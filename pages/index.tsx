import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import JSZip from "jszip";

import Top from "./components/Top";
import Chart from "./components/Chart";
import ThemeSwitch from "./components/ThemeSwitch";
import Carousel from "./components/Carousel";

import styles from "../styles/Home.module.css";
import { Play, Stats } from "./interfaces";
import { getKeyStats, getTime, getNextTimeUnit, getGraphData } from "./utils";

let autoTheme: any = null;

const Home: NextPage = () => {
  const [user, setUser] = useState<string | null>(null);
  const [selectedFile, setFile] = useState<File | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [unit, setUnit] = useState("minutes");
  const [theme, setTheme] = useState<string>("dark");
  const [loadSize, setLoadSize] = useState(1);

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const zipFile = event?.target?.files?.[0] || null;
    setFile(zipFile);
    if (!zipFile) return;
    const { files } = await JSZip.loadAsync(zipFile);

    let filePlays: Play[] = [];
    Object.values(files).forEach(async (file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (!file.name.includes("json")) return;

        const fileData = JSON.parse(
          Buffer.from(fileReader.result as ArrayBuffer).toString("utf8")
        );

        if (file.name.includes("StreamingHistory")) {
          filePlays = [...filePlays, ...fileData];
          setPlays(filePlays);
        }
        if (file.name.includes("Identity")) setUser(fileData.displayName);
      };

      const blob = await file.async("blob");
      fileReader.readAsArrayBuffer(blob);
    });
  };

  return (
    <div
      className={`${styles.body} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.container}>
        <Head>
          <title>Spoti&apos;stats</title>
          <meta
            name="description"
            content="Get stats about your spotify listens"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to Spoti&apos;stats</h1>

          <div className={styles.grid}>
            <div className={`${styles.card} ${styles.action}`}>
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileInput}
                    multiple={false}
                    accept=".zip"
                  />
                  <label htmlFor="file">Select a file</label>
                </>
              ) : (
                <label
                  onClick={() => {
                    setFile(null);
                    setPlays([]);
                    setUser(null);
                  }}
                >
                  {user || selectedFile.name}
                </label>
              )}
            </div>
            {plays.length ? (
              <>
                <div className={styles.card}>
                  <div>{plays.length} plays</div>
                  <div className={styles.secondary} style={{ paddingLeft: 0 }}>
                    {getKeyStats(plays, "trackName", false).length} songs
                  </div>
                </div>
                <div className={`${styles.card} ${styles.action}`}>
                  <label onClick={() => setUnit(getNextTimeUnit(unit))}>
                    {getTime(plays, unit)} {unit}
                  </label>
                </div>

                <Carousel
                  leftComponent={
                    <Top
                      name="track"
                      stats={getKeyStats(plays, "trackName", loadSize)}
                      unit={unit}
                      secondaryRenderer={(stats: Stats) => stats.artistName}
                    />
                  }
                  rightComponent={
                    <Top
                      name="artist"
                      stats={getKeyStats(plays, "artistName", loadSize)}
                      unit={unit}
                      secondaryRenderer={(stats: Stats) =>
                        `${Object.keys(stats.other).length || 0} songs`
                      }
                    />
                  }
                  loadSize={loadSize}
                  setLoadSize={setLoadSize}
                />
              </>
            ) : null}
          </div>
        </main>
      </div>
      <Chart data={getGraphData(plays)} theme={theme} />
    </div>
  );
};

export default Home;
