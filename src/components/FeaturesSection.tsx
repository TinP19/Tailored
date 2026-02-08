import { Cpu, Battery, Monitor, Wifi, HardDrive, Fingerprint } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Latest Processors",
    description: "Intel 13th Gen & AMD Ryzen 7000 series for unmatched performance.",
  },
  {
    icon: Battery,
    title: "All-Day Battery",
    description: "Up to 18 hours of battery life to power through your day.",
  },
  {
    icon: Monitor,
    title: "Stunning Displays",
    description: "4K OLED and high-refresh rate panels for immersive visuals.",
  },
  {
    icon: Wifi,
    title: "WiFi 6E Ready",
    description: "Lightning-fast wireless connectivity for seamless browsing.",
  },
  {
    icon: HardDrive,
    title: "Fast Storage",
    description: "PCIe Gen 4 NVMe SSDs for instant boot and app loading.",
  },
  {
    icon: Fingerprint,
    title: "Secure Login",
    description: "Fingerprint sensors and Windows Hello for quick, secure access.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every laptop in our collection is built with cutting-edge technology and designed for excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
