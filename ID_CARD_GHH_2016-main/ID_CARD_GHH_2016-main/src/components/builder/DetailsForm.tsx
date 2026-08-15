import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, User, Code, Users, Flame } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { NeoInput } from '../ui/NeoInput';
import { StickerBadge } from '../ui/StickerBadge';

export const DetailsForm: React.FC = () => {
  const builder = useBuilderStore((state) => state.builder);
  const setName = useBuilderStore((state) => state.setName);
  const setRole = useBuilderStore((state) => state.setRole);
  const setTeamName = useBuilderStore((state) => state.setTeamName);
  const setPower = useBuilderStore((state) => state.setPower);
  const regenerateTitle = useBuilderStore((state) => state.regenerateTitle);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Name & Role Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeoInput
          label="BUILDER NAME"
          placeholder="e.g. Joydip Acharjee"
          value={builder.name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="w-4 h-4" />}
          badge="Required"
          maxLength={30}
        />

        <NeoInput
          label="STACK / ROLE"
          placeholder="e.g. UI/UX + Frontend, AI, Rust..."
          value={builder.role}
          onChange={(e) => setRole(e.target.value)}
          icon={<Code className="w-4 h-4" />}
          badge="Required"
          maxLength={35}
        />
      </div>

      {/* 2. Team Name & Superpower Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeoInput
          label="TEAM NAME"
          placeholder="e.g. Pixel Pirates, Kernel Chaos"
          value={builder.teamName || ''}
          onChange={(e) => setTeamName(e.target.value)}
          icon={<Users className="w-4 h-4" />}
          badge="Optional"
          maxLength={30}
          helperText="Displays your squad / team on the passport."
        />

        <NeoInput
          label="SUPERPOWER / FUN FACT"
          placeholder="e.g. 3am deployment king, Chai fueled"
          value={builder.power}
          onChange={(e) => setPower(e.target.value)}
          icon={<Flame className="w-4 h-4" />}
          badge="Optional"
          maxLength={40}
          helperText="Adds a custom power stamp to your Goa Passport."
        />
      </div>

      {/* 3. Generated Builder Title Showcase & Re-roll */}
      <div className="bg-[#032011] border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-[11px] font-mono text-[#FEE101] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> YOUR GOA BUILDER TITLE
          </span>
          <motion.div
            key={builder.builderTitle}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <StickerBadge variant="yellow" size="lg" rotation={-1}>
              ⚡ {builder.builderTitle || 'GOA BUILDER'} ⚡
            </StickerBadge>
          </motion.div>
        </div>

        <button
          onClick={regenerateTitle}
          className="neo-button neo-button-pink text-xs font-black px-4 py-2.5 rounded-lg flex items-center gap-2"
          title="Roll a new random title"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>NEW TITLE ↻</span>
        </button>
      </div>
    </div>
  );
};
