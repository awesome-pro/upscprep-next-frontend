'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { courseService } from '@/services/course.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CheckoutPage() {
  try {
    const params = useParams();
    const course = await courseService.getCourseById(params.id as string);
    
    // Format price for display
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(course.price);
    
    return (
      <div className="container max-w-3xl py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/courses/${params.id}`} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Payment</CardTitle>
                    <CardDescription>Pay securely with your credit or debit card</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formattedPrice}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="upi" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>UPI Payment</CardTitle>
                    <CardDescription>Pay using any UPI app</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="yourname@upi" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Pay {formattedPrice}</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="netbanking" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Net Banking</CardTitle>
                    <CardDescription>Pay using your bank account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Select Bank</Label>
                      <select id="bank" className="w-full p-2 border rounded-md">
                        <option value="">Select your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Pay {formattedPrice}</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{course.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{course.duration} days</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>{formattedPrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching course:', error);
    notFound();
  }
}
