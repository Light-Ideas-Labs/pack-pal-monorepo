import { CallIcon, EmailIcon, MapIcon } from "@/components/icons";
import FooterSocials from "./footer-socials";

const aboutData = [
  {
    id: 1,
    icon: MapIcon,
    text: "Remote-first • Worldwide",
  },
  {
    id: 2,
    icon: CallIcon,
    text: "Mon–Fri, 9am–5pm",
  },
  {
    id: 3,
    icon: EmailIcon,
    text: "support@packpal.app",
  },
];

export default function FooterAbout() {
  return (
    <div className="max-w-[330px] w-full">
      <h2 className="mb-7.5 text-custom-1 font-medium text-dark">Help & Support</h2>

      <ul className="flex flex-col gap-3">
        {aboutData.map((item) => (
          <li key={item.id} className="flex gap-4.5 text-base">
            <span className="shrink-0">
              <item.icon className="fill-blue" width={24} height={24} />
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <FooterSocials />
    </div>
  );
}
