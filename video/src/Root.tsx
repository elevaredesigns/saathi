import { Composition, Folder, Still } from "remotion";
import { DocAI, DocApp, DocConsole, DocHero, DocLanguages } from "./saathi/Docs";
import { FILM_FRAMES, SaathiFilm, SCENES } from "./saathi/SaathiFilm";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="SaathiFilm" component={SaathiFilm} durationInFrames={FILM_FRAMES} fps={30} width={1920} height={1080} />
      <Folder name="Scenes">
        {SCENES.map((s) => (
          <Composition key={s.id} id={`Scene-${s.id}`} component={s.component} durationInFrames={s.frames} fps={30} width={1920} height={1080} />
        ))}
      </Folder>
      <Folder name="Docs">
        <Still id="DocHero" component={DocHero} width={2560} height={1280} />
        <Still id="DocApp" component={DocApp} width={2560} height={1200} />
        <Still id="DocAI" component={DocAI} width={2400} height={1200} />
        <Still id="DocLanguages" component={DocLanguages} width={2560} height={1200} />
        <Still id="DocConsole" component={DocConsole} width={2400} height={1480} />
      </Folder>
    </>
  );
};
