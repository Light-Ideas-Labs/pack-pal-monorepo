import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@/components/icons"
import Link from 'next/link'

const socials = [
  { id: 1, href: "https://twitter.com/", name: "X (Twitter)", icon: TwitterIcon },
  { id: 2, href: "https://instagram.com/", name: "Instagram", icon: InstagramIcon },
  { id: 3, href: "https://linkedin.com/company/", name: "LinkedIn", icon: LinkedInIcon },
  { id: 4, href: "https://facebook.com/", name: "Facebook", icon: FacebookIcon },
];

export default function FooterSocials() {
  return (
    <div className="flex items-center gap-4 mt-7.5">
      {socials.map((social) => (
        <Link key={social.id} href={social.href} className="flex ease-out duration-200 hover:text-blue" target="_blank" rel="noopener noreferrer">
          <span className="sr-only">{social.name} link</span>
          <social.icon />
        </Link>
      ))}
    </div>
  );
}
