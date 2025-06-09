"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ProposalForm() {
  const [formData, setFormData] = useState({
    projectType: "",
    projectDetails: "",
    tone: "Profesional",
    hourlyRate: "",
    estimatedHours: "",
    lang: "ID",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateProposal = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data.proposal);
    setLoading(false);
  };

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

            <div className="space-y-2">
              <Label htmlFor="tone">Gaya Bahasa</Label>
              <Input
                id="tone"
                name="tone"
                placeholder="Profesional, Kasual, atau Korporat"
                onChange={handleChange}
              />
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

      {result && (
        <Card className="bg-muted/30 border border-muted rounded-xl">
          <CardContent className="py-6 space-y-4">
            <h2 className="text-lg font-semibold">Proposal yang Dihasilkan</h2>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              {result}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
