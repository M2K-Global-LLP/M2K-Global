import { Building2, Handshake, Monitor, Languages, GraduationCap, Landmark, BriefcaseBusiness, Pickaxe, BookOpen, MessagesSquare, Compass, ListChecks, Network, ScanLine, ShieldCheck, Layers, Search, FileText, ExternalLink, FolderCheck, Globe2, type LucideIcon } from "lucide-react";
const icons: Record<string, LucideIcon> = { Building2, Handshake, Monitor, Languages, GraduationCap, Landmark, BriefcaseBusiness, Pickaxe, BookOpen, MessagesSquare, Compass, ListChecks, Network, ScanLine, ShieldCheck, Layers, Search, FileText, ExternalLink, FolderCheck, Globe2 };
export function iconFor(name: string): LucideIcon { return icons[name] ?? Layers; }

