import { ImageResponse } from "next/og";
import { getPlayerById } from "@/app/lib/players";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: { id: string };
}) {
  const player = await getPlayerById(params.id);

  if (!player) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#020617",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
          }}
        >
          Player not found
        </div>
      ),
      size
    );
  }

  const winRate =
    player.wins + player.losses > 0
      ? Math.round((player.wins / (player.wins + player.losses)) * 100)
      : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #020617 0%, #5b21b6 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: "#ffffff",
        }}
      >
        {/* Top: Logo & Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "#d946ef",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            ⚔
          </div>
          <span style={{ fontSize: 32, fontWeight: 600 }}>Ave Forge</span>
        </div>

        {/* Center: Player Info */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
            {player.displayName}
          </div>

          <div
            style={{
              fontSize: 28,
              opacity: 0.8,
              marginTop: 12,
            }}
          >
            {player.handle} • Level {player.level}
          </div>

          <div
            style={{
              display: "flex",
              gap: 48,
              marginTop: 40,
              fontSize: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>{player.wins}</div>
              <div style={{ opacity: 0.7 }}>Wins</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                {player.missionsCompleted}
              </div>
              <div style={{ opacity: 0.7 }}>Missions</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.1)",
                padding: "16px 24px",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>{winRate}%</div>
              <div style={{ opacity: 0.7 }}>Win Rate</div>
            </div>
          </div>
        </div>

        {/* Bottom: Accent Bar */}
        <div
          style={{
            width: 160,
            height: 6,
            background: "linear-gradient(90deg, #d946ef 0%, #a855f7 100%)",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    size
  );
}

