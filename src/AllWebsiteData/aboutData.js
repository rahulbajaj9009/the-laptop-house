import {
  Laptop,
  Wrench,
  MessageCircle,
  BadgeCheck,
  ShieldCheck,
  MonitorCog,
} from "lucide-react";

export const services = [
  {
    icon: Laptop,
    number: "01",
    title: "Find the Right Device",
    text: "Get personalized help choosing a laptop, desktop, or accessories tailored to your workload and budget.",
    tag: "Consultation",
  },
  {
    icon: Wrench,
    number: "02",
    title: "Repair & Upgrades",
    text: "Expert servicing, RAM/SSD speed upgrades, thermal repasting, and quick hardware diagnostics.",
    tag: "Hardware Support",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Real Help, In Person",
    text: "Visit our Rohtak store or contact us directly. Honest advice without sales pitch gimmicks.",
    tag: "Local Support",
  },
];

export const assurances = [
  {
    icon: BadgeCheck,
    label: "Expert Product Guidance",
    desc: "Tailored options based on actual usage",
  },
  {
    icon: ShieldCheck,
    label: "Genuine Brand Warranty",
    desc: "100% original products & official support",
  },
  {
    icon: MonitorCog,
    label: "Post-Purchase Support",
    desc: "Assistance with setup, repairs & tuning",
  },
];