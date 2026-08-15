import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Download, Share2, RefreshCw } from 'lucide-react';
import { useBuilderStore, BuilderData } from '../../store/builderStore';
import { generateCrewGraphic, CREW_WIDTH, CREW_HEIGHT } from '../../canvas/generateCrewGraphic';
import { UploadZone } from '../upload/UploadZone';
import { PhotoAdjuster } from '../upload/PhotoAdjuster';
import { NeoInput } from '../ui/NeoInput';
import { StickerButton } from '../ui/StickerButton';
import { StickerBadge } from '../ui/StickerBadge';
import { downloadImage } from '../../utils/image';
import { shareToXWithImage } from '../../utils/share';
import { fireGoaConfetti } from '../ui/Confetti';
import { getBuilderTitle } from '../../data/builderTitles';

export const CrewStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeMemberIdx, setActiveMemberIdx] = useState<number>(0);
  const [isAdjustingPhoto, setIsAdjustingPhoto] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const crew = useBuilderStore((state) => state.crew);
  const addCrewMember = useBuilderStore((state) => state.addCrewMember);
  const updateCrewMember = useBuilderStore((state) => state.updateCrewMember);
  const removeCrewMember = useBuilderStore((state) => state.removeCrewMember);
  const primaryBuilder = useBuilderStore((state) => state.builder);
  const crewGeneratedDataUrl = useBuilderStore((state) => state.crewGeneratedDataUrl);
  const crewGeneratedBlob = useBuilderStore((state) => state.crewGeneratedBlob);
  const setCrewGeneratedResult = useBuilderStore((state) => state.setCrewGeneratedResult);
  const showToast = useBuilderStore((state) => state.showToast);

  // Initialize crew with primary builder if empty
  useEffect(() => {
    if (crew.length === 0) {
      addCrewMember({
        ...primaryBuilder,
        id: `crew-1`,
        name: primaryBuilder.name || 'Builder 1',
        role: primaryBuilder.role || 'Frontend / AI',
        builderTitle: primaryBuilder.builderTitle || 'CODE NOMAD',
      });
    }
  }, []);

  const handleAddMember = () => {
    if (crew.length >= 3) {
      showToast('Maximum 3 crew members in the frame!');
      return;
    }
    const newIdx = crew.length + 1;
    const newMember: BuilderData = {
      id: `crew-${Date.now()}`,
      name: `Builder ${newIdx}`,
      role: 'Backend / Systems',
      teamName: '',
      power: '',
      builderTitle: getBuilderTitle('Backend', `Builder ${newIdx}`),
      photo: null,
      rawFile: null,
      style: 'beach-club',
      photoZoom: 1.0,
      photoPosition: { x: 0, y: 0 },
    };
    addCrewMember(newMember);
    setActiveMemberIdx(crew.length);
    showToast(`Added Builder ${newIdx}! Drop their photo.`);
  };

  // Re-render Crew Canvas whenever crew data changes
  useEffect(() => {
    let isCancelled = false;

    const renderCrew = async () => {
      if (!canvasRef.current || crew.length === 0) return;
      try {
        const result = await generateCrewGraphic(crew, canvasRef.current);
        if (!isCancelled) {
          setCrewGeneratedResult(result.dataUrl, result.blob);
        }
      } catch (err) {
        console.error('Crew render error:', err);
      }
    };

    const timeout = setTimeout(renderCrew, 50);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [crew]);

  const currentMember = crew[activeMemberIdx] || crew[0];

  const handleDownloadCrew = () => {
    if (!crewGeneratedDataUrl) {
      showToast('Crew poster is rendering...');
      return;
    }
    downloadImage(crewGeneratedDataUrl, 'hh-goa-2026-crew-poster.png');
    fireGoaConfetti();
    showToast('Downloaded official HH Goa Crew Poster! 🌴');
  };

  const handleShareX = async () => {
    if (!crewGeneratedBlob && !crewGeneratedDataUrl) {
      showToast('Crew poster is still rendering, please wait a moment...');
      return;
    }

    setIsSharing(true);
    fireGoaConfetti();

    try {
      await shareToXWithImage(
        {
          name: 'The Crew',
          role: 'Hackers',
          builderTitle: 'CREW',
          blob: crewGeneratedBlob,
          dataUrl: crewGeneratedDataUrl,
          isCrew: true,
        },
        (msg) => showToast(msg)
      );
    } catch (err) {
      console.error('Crew share error:', err);
      showToast('Could not open X. Please try again!');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-white/20 pb-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <StickerBadge variant="pink" size="sm" rotation={-2}>
              CREW MODE
            </StickerBadge>
            <span className="text-xs font-mono text-[#FEE101]">UP TO 3 BUILDERS</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-4xl uppercase tracking-wider text-[#FFFDF5]">
            BUILD WITH YOUR CREW 🌴
          </h1>
          <p className="text-xs md:text-sm text-white/70">
            Generate a 1600 × 900 landscape poster featuring your squad.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <StickerButton
            variant="yellow"
            size="md"
            onClick={handleDownloadCrew}
            icon={<Download className="w-4 h-4 stroke-[2.5]" />}
          >
            DOWNLOAD POSTER
          </StickerButton>
          <StickerButton
            variant="pink"
            size="md"
            onClick={handleShareX}
            icon={<Share2 className="w-4 h-4 stroke-[2.5]" />}
          >
            {isSharing ? 'OPENING X...' : 'SHARE TO X'}
          </StickerButton>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Canvas Preview (1600x900) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full rounded-2xl overflow-hidden border-4 border-black bg-black shadow-[8px_8px_0px_0px_#000000]">
            <canvas
              ref={canvasRef}
              width={CREW_WIDTH}
              height={CREW_HEIGHT}
              className="w-full h-auto block"
              style={{ aspectRatio: '1600 / 900' }}
            />
          </div>

          <div className="bg-[#032011] border-2 border-black p-3 rounded-xl flex items-center justify-between text-xs text-white/70">
            <span className="font-mono">1600 × 900 High-Res Poster</span>
            <span className="font-bold text-[#FEE101]">#FrameInGoa · #HHGoa</span>
          </div>
        </div>

        {/* Right Column: Crew Builder Management & Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-[#084E2A] p-5 md:p-6 rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_#000000]">
          {/* Builder Tabs */}
          <div className="flex items-center justify-between gap-2 border-b-2 border-black/30 pb-3">
            <div className="flex items-center gap-2">
              {crew.map((member, idx) => (
                <button
                  key={member.id || idx}
                  onClick={() => {
                    setActiveMemberIdx(idx);
                    setIsAdjustingPhoto(false);
                  }}
                  className={`
                    px-3.5 py-1.5 rounded-lg border-2 border-black font-display text-xs font-black uppercase transition-all
                    ${activeMemberIdx === idx
                      ? 'bg-[#FEE101] text-black shadow-[3px_3px_0px_0px_#000000] scale-105'
                      : 'bg-black/30 text-white/80 hover:bg-black/50'
                    }
                  `}
                >
                  {member.name ? member.name.split(' ')[0] : `Builder ${idx + 1}`}
                </button>
              ))}
            </div>

            {crew.length < 3 && (
              <button
                onClick={handleAddMember}
                className="neo-button neo-button-pink text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1"
                title="Add Crew Member"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>

          {currentMember && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-sm uppercase text-[#FFFDF5]">
                  EDITING: {currentMember.name || `BUILDER ${activeMemberIdx + 1}`}
                </span>
                {crew.length > 1 && (
                  <button
                    onClick={() => {
                      removeCrewMember(activeMemberIdx);
                      setActiveMemberIdx(Math.max(0, activeMemberIdx - 1));
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 uppercase hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Photo Upload or Adjuster */}
              {!currentMember.photo || isAdjustingPhoto ? (
                <div className="flex flex-col gap-2">
                  <UploadZone
                    compact
                    label={`UPLOAD PHOTO FOR ${currentMember.name || `BUILDER ${activeMemberIdx + 1}`}`}
                    onPhotoProcessed={(url) => {
                      updateCrewMember(activeMemberIdx, { photo: url });
                      setIsAdjustingPhoto(false);
                    }}
                  />
                  {currentMember.photo && (
                    <button
                      onClick={() => setIsAdjustingPhoto(false)}
                      className="text-xs text-white/80 hover:underline text-center"
                    >
                      Done Adjusting
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <PhotoAdjuster
                    photo={currentMember.photo}
                    zoom={currentMember.photoZoom || 1.0}
                    panX={currentMember.photoPosition?.x || 0}
                    panY={currentMember.photoPosition?.y || 0}
                    onChangeZoom={(zoom) => updateCrewMember(activeMemberIdx, { photoZoom: zoom })}
                    onChangePan={(pos) =>
                      updateCrewMember(activeMemberIdx, {
                        photoPosition: { ...currentMember.photoPosition, ...pos },
                      })
                    }
                    onChangePhotoClick={() => setIsAdjustingPhoto(true)}
                  />
                </div>
              )}

              {/* Inputs */}
              <NeoInput
                label="NAME"
                placeholder="Builder name"
                value={currentMember.name}
                onChange={(e) => updateCrewMember(activeMemberIdx, { name: e.target.value })}
              />

              <NeoInput
                label="ROLE / STACK"
                placeholder="e.g. Smart Contracts, UI/UX"
                value={currentMember.role}
                onChange={(e) => updateCrewMember(activeMemberIdx, { role: e.target.value })}
              />

              {/* Title Generator for this Member */}
              <div className="bg-[#032011] p-3 rounded-xl border-2 border-black flex items-center justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono text-[#FEE101] font-bold uppercase">
                    BUILDER TITLE
                  </span>
                  <span className="font-display font-black text-xs md:text-sm text-white">
                    ⚡ {currentMember.builderTitle || 'GOA BUILDER'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newTitle = getBuilderTitle(currentMember.role, currentMember.name, true);
                    updateCrewMember(activeMemberIdx, { builderTitle: newTitle });
                  }}
                  className="p-1.5 rounded bg-[#FEE101] text-black border border-black hover:rotate-45 transition-transform"
                  title="Randomize Title"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
