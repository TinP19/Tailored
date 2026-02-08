import { Send, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  shop: ['New Arrivals', 'Best Sellers', 'Deals', 'Laptops', 'Audio', 'Gaming'],
  support: ['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Warranty', 'Track Order'],
  company: ['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliates', 'Blog'],
};

const paymentMethods = ['Visa', 'Mastercard', 'Apple Pay', 'PayPal', 'Klarna'];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <a href="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">TechHaven</span>
            </a>
            <p className="text-muted-foreground max-w-sm">
              Your destination for premium tech at unbeatable prices. Free next-day delivery on all orders.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="font-medium text-foreground">Get exclusive deals</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-secondary/50 border-border/50 max-w-xs"
                />
                <Button className="bg-primary hover:bg-primary/90 glow-primary-hover">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">We accept:</span>
              <div className="flex items-center gap-3">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="text-xs bg-secondary/50 px-2 py-1 rounded text-muted-foreground"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2026 TechHaven. All rights reserved. Built for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
