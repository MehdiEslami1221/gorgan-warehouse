'use client';

import { Code2, Instagram, Globe, ArrowUpLeft } from 'lucide-react';

const contacts = [
  { label: 'اینستاگرام', value: 'mage.code', href: 'https://www.instagram.com/mage.code/', icon: Instagram, external: true },
  { label: 'وب‌سایت', value: 'ejrasys.ir', href: 'https://ejrasys.ir', icon: Globe, external: true },
];

export default function DeveloperPanel() {
  return <>
    <div className="section-heading">
      <div><h2>درباره برنامه‌نویس</h2><p>طراحی و توسعه سامانه انبار شهرداری منطقه ۲ گرگان</p></div>
    </div>
    <section className="developer-card panel" aria-label="اطلاعات برنامه‌نویس">
      <div className="developer-cover"><Code2 size={34} strokeWidth={1.5}/><span dir="ltr">MAGE.CODE</span></div>
      <div className="developer-body">
        <div className="developer-identity">
          <div className="developer-avatar" aria-hidden="true">م ا</div>
          <div><span className="developer-label">برنامه‌نویس</span><h3>مهدی اسلامی</h3><p>طراحی و توسعه نرم‌افزار</p></div>
        </div>
        <p className="developer-description">سامانه مدیریت انبار شهرداری منطقه ۲ گرگان، طراحی و توسعه‌ی مهدی اسلامی.</p>
        <div className="developer-contacts">
          {contacts.map(({ label, value, href, icon: Icon, external }) => <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="developer-contact" aria-label={`${label}: ${value}`}>
            <span className="developer-contact-icon"><Icon size={20}/></span>
            <div><span>{label}</span><b dir="ltr">{value}</b></div>
            <ArrowUpLeft size={17} className="developer-contact-arrow"/>
          </a>)}
        </div>
      </div>
      <div className="developer-signature"><Code2 size={16}/><span>طراحی و توسعه: مهدی اسلامی</span><span dir="ltr">mage.code</span></div>
    </section>
  </>;
}
