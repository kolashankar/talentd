
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleAuth } from "@/components/auth/google-auth";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, FileText, Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaxCalculation {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: {
    slab: string;
    rate: number;
    taxAmount: number;
  }[];
}

export default function TaxCalculator() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [regime, setRegime] = useState<string>("new");
  const [ageGroup, setAgeGroup] = useState<string>("below60");
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const { toast } = useToast();

  // Check authentication status
  const { data: authStatus, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: async () => {
      const response = await fetch('/api/auth/status', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to check auth status');
      return response.json();
    },
    retry: false,
  });

  const calculateTax = () => {
    if (!authStatus?.authenticated) {
      setShowAuthDialog(true);
      toast({
        title: "Sign In Required",
        description: "Please sign in to use the tax calculator",
        variant: "destructive",
      });
      return;
    }

    const taxableIncome = Math.max(0, grossIncome - deductions);
    let totalTax = 0;
    const breakdown: { slab: string; rate: number; taxAmount: number; }[] = [];

    // Tax slabs for new regime (2023-24)
    const newRegimeSlabs = [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 5 },
      { min: 600000, max: 900000, rate: 10 },
      { min: 900000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 },
    ];

    // Tax slabs for old regime
    const oldRegimeSlabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ];

    const slabs = regime === "new" ? newRegimeSlabs : oldRegimeSlabs;

    for (const slab of slabs) {
      if (taxableIncome <= slab.min) break;
      
      const slabIncome = Math.min(taxableIncome, slab.max) - slab.min;
      const slabTax = (slabIncome * slab.rate) / 100;
      
      if (slabTax > 0) {
        totalTax += slabTax;
        breakdown.push({
          slab: slab.max === Infinity 
            ? `Above ₹${slab.min.toLocaleString()}` 
            : `₹${slab.min.toLocaleString()} - ₹${slab.max.toLocaleString()}`,
          rate: slab.rate,
          taxAmount: slabTax
        });
      }
    }

    // Add cess (4% on total tax)
    const cess = totalTax * 0.04;
    totalTax += cess;

    const netIncome = grossIncome - totalTax;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
    const marginalRate = slabs.find(slab => taxableIncome > slab.min && taxableIncome <= slab.max)?.rate || 0;

    setCalculation({
      grossIncome,
      taxableIncome,
      totalTax,
      netIncome,
      effectiveRate,
      marginalRate,
      breakdown
    });

    toast({
      title: "Tax Calculated",
      description: `Your tax liability is ₹${totalTax.toLocaleString()}`,
    });
  };

  const downloadReport = () => {
    if (!calculation) return;

    const reportContent = `
INCOME TAX CALCULATION REPORT
============================

Gross Income: ₹${calculation.grossIncome.toLocaleString()}
Deductions: ₹${deductions.toLocaleString()}
Taxable Income: ₹${calculation.taxableIncome.toLocaleString()}

Tax Breakdown:
${calculation.breakdown.map(item => 
  `${item.slab}: ${item.rate}% = ₹${item.taxAmount.toLocaleString()}`
).join('\n')}

Total Tax: ₹${calculation.totalTax.toLocaleString()}
Net Income: ₹${calculation.netIncome.toLocaleString()}
Effective Rate: ${calculation.effectiveRate.toFixed(2)}%
Marginal Rate: ${calculation.marginalRate}%

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax-calculation-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!authStatus?.authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Calculator className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Income Tax Calculator</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Calculate your income tax liability with our advanced tax calculator
            </p>
            <div className="max-w-md mx-auto">
              <GoogleAuth 
                showDialog={showAuthDialog}
                onClose={() => setShowAuthDialog(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Income Tax Calculator</h1>
          <p className="text-xl text-muted-foreground">
            Calculate your income tax liability for FY 2023-24
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Tax Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="grossIncome">Annual Gross Income (₹)</Label>
                <Input
                  id="grossIncome"
                  type="number"
                  value={grossIncome || ''}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  placeholder="Enter your annual income"
                />
              </div>

              <div>
                <Label htmlFor="deductions">Total Deductions (₹)</Label>
                <Input
                  id="deductions"
                  type="number"
                  value={deductions || ''}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  placeholder="80C, 80D, etc."
                />
              </div>

              <div>
                <Label htmlFor="regime">Tax Regime</Label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Tax Regime</SelectItem>
                    <SelectItem value="old">Old Tax Regime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below60">Below 60 years</SelectItem>
                    <SelectItem value="60to80">60-80 years</SelectItem>
                    <SelectItem value="above80">Above 80 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateTax} className="w-full" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Tax
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Tax Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calculation ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Tax</p>
                      <p className="text-2xl font-bold text-red-600">
                        ₹{calculation.totalTax.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Net Income</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{calculation.netIncome.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Effective Tax Rate</Label>
                      <Badge variant="secondary" className="ml-2">
                        {calculation.effectiveRate.toFixed(2)}%
                      </Badge>
                    </div>
                    <div>
                      <Label>Marginal Tax Rate</Label>
                      <Badge variant="secondary" className="ml-2">
                        {calculation.marginalRate}%
                      </Badge>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div>
                    <Label className="text-base font-semibold">Tax Breakdown</Label>
                    <div className="mt-2 space-y-2">
                      {calculation.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                          <span className="text-sm">{item.slab}</span>
                          <div className="text-right">
                            <Badge variant="outline" className="mr-2">{item.rate}%</Badge>
                            <span className="font-medium">₹{item.taxAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={downloadReport} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter your income details and click calculate to see your tax liability
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tax Slabs Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tax Slabs Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">New Tax Regime (FY 2023-24)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>₹0 - ₹3,00,000</span>
                    <Badge variant="secondary">0%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹3,00,001 - ₹6,00,000</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹6,00,001 - ₹9,00,000</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹9,00,001 - ₹12,00,000</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹12,00,001 - ₹15,00,000</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Above ₹15,00,000</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Old Tax Regime</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>₹0 - ₹2,50,000</span>
                    <Badge variant="secondary">0%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹2,50,001 - ₹5,00,000</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>₹5,00,001 - ₹10,00,000</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Above ₹10,00,000</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Plus deductions under 80C, 80D, etc.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
