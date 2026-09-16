import React, { useState } from 'react';
import { AdminCMSState, AdminView } from '../types';

interface HomepageCMSViewProps {
  cms: AdminCMSState;
  onNavigate: (view: AdminView) => void;
  onUpdateCMS: (cms: AdminCMSState) => void;
  onShowToast: (msg: string) => void;
}

export const HomepageCMSView: React.FC<HomepageCMSViewProps> = ({
  cms,
  onNavigate,
  onUpdateCMS,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<AdminCMSState>(cms);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCMS(formData);
    onShowToast('Storefront homepage & editorial narrative updated.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded6be]/80 pb-4">
        <div>
          <h1 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#18281b] tracking-tight">
            Storefront CMS & Editorial Curator
          </h1>
          <p className="text-[12px] text-[#5c725f]">
            Configure homepage hero banner, bilingual storytelling copy, and seasonal showcase.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#18281b] hover:bg-[#283d2b] text-white text-[12px] font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>Publish Changes</span>
        </button>
      </div>

      {/* 1. Announcement Strip Bar */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
              campaign
            </span>
            <span>Storefront Top Announcement Strip</span>
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.announcementBar.enabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcementBar: { ...formData.announcementBar, enabled: e.target.checked },
                })
              }
              className="rounded text-[#18281b]"
            />
            <span className="text-[12px] font-semibold text-[#18281b]">Enable Strip</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Announcement Copy (English)
            </label>
            <input
              type="text"
              value={formData.announcementBar.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcementBar: { ...formData.announcementBar, text: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Announcement Copy (বাংলা)
            </label>
            <input
              type="text"
              value={formData.announcementBar.textBn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  announcementBar: { ...formData.announcementBar, textBn: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px] text-[#18281b] focus:bg-white focus:outline-none focus:border-[#18281b]"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Editorial Banner */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            view_carousel
          </span>
          <span>Primary Hero Section</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Hero Title (English)
            </label>
            <input
              type="text"
              value={formData.hero.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, title: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] font-serif font-bold text-[#18281b]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Hero Title (বাংলা)
            </label>
            <input
              type="text"
              value={formData.hero.titleBn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, titleBn: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[13px] font-serif font-bold text-[#18281b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Subtitle (English)
            </label>
            <input
              type="text"
              value={formData.hero.subtitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, subtitle: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Hero Background Image URL
            </label>
            <input
              type="url"
              value={formData.hero.backgroundImage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, backgroundImage: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px]"
            />
          </div>
        </div>
      </div>

      {/* 3. Atelier Heritage Narrative */}
      <div className="bg-white rounded-2xl border border-[#ded6be] p-5 shadow-xs space-y-4">
        <h3 className="font-serif text-[16px] font-bold text-[#18281b] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2d6636]">
            history_edu
          </span>
          <span>Atelier Heritage & Craft Narrative</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Editorial Heading
            </label>
            <input
              type="text"
              value={formData.atelierStory.heading}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  atelierStory: { ...formData.atelierStory, heading: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
              Editorial Heading (বাংলা)
            </label>
            <input
              type="text"
              value={formData.atelierStory.headingBn}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  atelierStory: { ...formData.atelierStory, headingBn: e.target.value },
                })
              }
              className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl px-3 py-2 text-[12px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#5c725f] uppercase tracking-wider mb-1">
            Story Body (English)
          </label>
          <textarea
            rows={3}
            value={formData.atelierStory.body}
            onChange={(e) =>
              setFormData({
                ...formData,
                atelierStory: { ...formData.atelierStory, body: e.target.value },
              })
            }
            className="w-full bg-[#faf7ed] border border-[#ded6be] rounded-xl p-3 text-[12px]"
          />
        </div>
      </div>
    </form>
  );
};
