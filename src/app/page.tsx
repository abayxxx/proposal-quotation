"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToastError } from "@/components/toastError";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyIcon, FileDownIcon } from "lucide-react";
import { ToastSuccess } from "@/components/toastSuccess";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { trimMd } from "@/lib/trimMd";
import docxConverter from "@/lib/docxConverter";
import pdfConverter from "@/lib/pdfConverter";
import { Progress } from "@/components/ui/progress";

export default function ProposalForm() {
  const [formData, setFormData] = useState({
    projectType: "",
    projectDetails: "",
    tone: "Profesional",
    hourlyRate: "",
    estimatedHours: "",
    language: "indonesia",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(13);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = (format: string) => {
    if (!result) {
      ToastError("Tidak ada proposal yang dihasilkan untuk diunduh.");
      return;
    }

    if (format !== "pdf" && format !== "docx") {
      ToastError("Format tidak didukung. Pilih PDF atau DOCX.");
      return;
    }

    if (format === "pdf") {
      // Convert result to PDF
      pdfConverter.convertToPDF(
        trimMd(result),
        {
          format: "a4",
          landscape: false,
          fontSize: 10,
          fontFamily: "Helvetica",
          fontStyle: "normal",
          unit: "pt",
        },
        "proposal.pdf"
      );
    } else if (format === "docx") {
      // Convert result to DOCX
      docxConverter(trimMd(result), "proposal.docx");
    }

    ToastSuccess(`Proposal berhasil diunduh sebagai ${format.toUpperCase()}!`);
  };

  const generateProposal = async () => {
    setLoading(true);
    setResult("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data.proposal);
    setLoading(false);

    if (!res.ok) {
      console.error("Error generating proposal:", data.error);
      ToastError("Gagal menghasilkan proposal. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 10) + 5; // Increment by 5-15
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="shadow-sm border border-muted bg-white rounded-xl">
        <CardContent className="space-y-6 py-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              AI Proposal Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Isi detail proyekmu dan dapatkan proposal otomatis.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType">Jenis Proyek</Label>
              <Input
                id="projectType"
                name="projectType"
                placeholder="Contoh: Website Company Profile"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Detail Proyek</Label>
              <Textarea
                id="projectDetails"
                name="projectDetails"
                placeholder="Fitur, target user, platform, deadline, dll"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Bahasa</Label>
                <Select
                  name="language"
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                  defaultValue="indonesia"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Bahasa</SelectLabel>
                      <SelectItem value="indonesia">Indonesia</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Gaya Bahasa</Label>
                <Input
                  id="tone"
                  name="tone"
                  placeholder="Profesional, Kasual, atau Korporat"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Rate per Jam (Rp)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  placeholder="Contoh: 150000"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimasi Jam Kerja</Label>
                <Input
                  id="estimatedHours"
                  name="estimatedHours"
                  placeholder="Contoh: 30"
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button onClick={generateProposal} disabled={loading}>
              {loading ? "Membuat..." : "Buat Proposal"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center text-muted-foreground">
          <p className="mt-2">Sedang membuat proposal...</p>
          <Progress className="w-full" value={progress} />
        </div>
      )}
      {result && (
        <Card className="bg-muted/30 border border-muted rounded-xl">
          <CardContent className="py-6 space-y-4">
            <div className="flex justify-end gap-1">
              <Button
                variant="default"
                size="icon"
                className="right-1 cursor-pointer top-1"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  ToastSuccess("Proposal telah disalin ke clipboard!");
                }}
              >
                <CopyIcon className="size-4" />
              </Button>
              <div className=" right-1 cursor-pointer top-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="icon">
                      <span className="sr-only">Download</span>
                      <FileDownIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                        PDF
                        <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload("docx")}>
                        DOCX
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div></div>
            <h2 className="text-lg font-semibold">Proposal yang Dihasilkan</h2>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {result}
              </ReactMarkdown>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
