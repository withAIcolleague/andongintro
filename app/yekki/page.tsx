import type { Metadata } from "next"
import Link from "next/link"
import { RevealSection } from "@/components/reveal-section"
import { YekkiScrollIndicator } from "@/components/yekki-scroll-indicator"

export const metadata: Metadata = {
  title: "예끼마을 - 시간이 머무는 도시, 안동",
  description:
    "수몰된 역사를 예술로 피워낸 수변 마을. 선성수상길, 갤러리, 벽화 골목, 한옥체험까지.",
}

export default function YekkiPage() {
  return (
    <>
      <header className="yekki-header">
        <div className="nav">
          <Link href="/" className="logo">
            <span className="logo-stamp">
              <span>{"안"}</span>
              <span>{"동"}</span>
            </span>
            ANDONG
          </Link>
          <nav className="nav-links">
            <a href="#memory">{"기억"}</a>
            <a href="#walk">{"산책"}</a>
            <a href="#art">{"예술"}</a>
            <a href="#stay">{"휴식"}</a>
            <a href="#info">{"정보"}</a>
          </nav>
        </div>
      </header>

      <YekkiScrollIndicator />

      {/* Hero */}
      <section className="yekki-hero" id="hero">
        <div className="yekki-hero-bg" />
        <div className="yekki-hero-content">
          <small style={{ letterSpacing: "5px", opacity: 0.8 }}>
            THE VILLAGE OF ART &amp; TALENT
          </small>
          <h1>
            {"예끼마을 "}
            <span className="vertical-label">{"宣城(선성)"}</span>
          </h1>
          <p style={{ fontSize: "20px", fontWeight: 300, marginTop: "30px" }}>
            {"수몰된 역사를 예술로 피워낸 수변 마을"}
          </p>
        </div>
      </section>

      {/* Memory */}
      <section className="memory-section" id="memory">
        <RevealSection className="memory-content">
          <div className="memory-text">
            <small style={{ color: "var(--accent-red)", fontWeight: 700 }}>
              HISTORY
            </small>
            <h2>{"선성의 기억"}</h2>
            <p>
              {"1976년 안동댐 건설로 수몰된 예안면 주민들의 삶과 애환이 서린 곳."}
              <br />
              {"발아래 잠긴 고향의 기억을 예술이라는 새로운 숨결로 보듬어 형성된 각별한 마을입니다."}
            </p>
            <p style={{ marginTop: "20px", color: "#777" }}>
              {"조선 시대 지명인 '선성(宣城)'의 역사성을 바탕으로, 이제는 예술가들이 모여 새로운 창작의 시간을 겹겹이 쌓아가고 있습니다."}
            </p>
          </div>
          <div className="memory-img" />
        </RevealSection>
      </section>

      {/* Walk */}
      <section className="yekki-section" id="walk">
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <small style={{ color: "var(--accent-2)", fontWeight: 700 }}>
            WATERFRONT
          </small>
          <h2
            style={{
              fontSize: "42px",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {"물 위의 산책"}
          </h2>
          <p style={{ color: "#666" }}>{"호수 위를 걷는 기하학적 미학, 선성수상길"}</p>
        </div>

        <div className="yekki-grid">
          <RevealSection className="art-card" style={{ gridColumn: "span 12" }}>
            <div
              className="img"
              style={{
                backgroundImage: "url('/assets/susanggil.jpg')",
                height: "500px",
              }}
            />
            <div className="art-card-content">
              <h3>{"선성수상길 (Seonseong Susang-gil)"}</h3>
              <p>
                {"안동호 위로 뻗은 1.1km의 부교. 물결을 따라 흔들리는 다리 위에서 수몰된 고향을 그리는 실향민의 마음과 안동호의 광활한 평온을 동시에 마주합니다."}
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Art */}
      <section className="yekki-section" id="art">
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <small style={{ color: "var(--accent-red)", fontWeight: 700 }}>
            CREATIVITY
          </small>
          <h2
            style={{
              fontSize: "42px",
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            {"예술의 거리"}
          </h2>
        </div>

        <div className="yekki-grid">
          <RevealSection className="art-card" style={{ gridColumn: "span 6" }}>
            <div
              className="img"
              style={{ backgroundImage: "url('/assets/gunmindang.jpg')" }}
            />
            <div className="art-card-content">
              <h3>{"근민당 갤러리"}</h3>
              <p>
                {"조선 시대 관아를 현대적인 전시 공간으로 재탄생시킨 곳. 전통 건축의 서까래 아래 펼쳐지는 현대 미술의 조화를 만나보세요."}
              </p>
            </div>
          </RevealSection>
          <RevealSection className="art-card" style={{ gridColumn: "span 6" }}>
            <div
              className="img"
              style={{ backgroundImage: "url('/assets/artwall.jpg')" }}
            />
            <div className="art-card-content">
              <h3>{"벽화 & 트릭아트 골목"}</h3>
              <p>
                {"마을 골목마다 주민과 예술가들이 함께 그려낸 위트 있는 기록들. 걸음마다 멈춰 서게 만드는 창의적인 '끼'를 발견하는 재미가 있습니다."}
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Stay */}
      <section className="memory-section" id="stay" style={{ background: "#F0EDE5" }}>
        <div className="yekki-section">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <small style={{ color: "var(--accent)", fontWeight: 700 }}>
              CONFUCIAN STAY
            </small>
            <h2
              style={{
                fontSize: "42px",
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              {"선비의 하룻밤"}
            </h2>
          </div>

          <div className="yekki-grid">
            <RevealSection
              className="art-card"
              style={{ gridColumn: "span 7" }}
            >
              <div
                className="img"
                style={{
                  backgroundImage: "url('/assets/hanokmaul.jpg')",
                  height: "400px",
                }}
              />
            </RevealSection>
            <RevealSection
              className="art-card"
              style={{
                gridColumn: "span 5",
                background: "transparent",
                backdropFilter: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <h3>{"선성현 문화단지 & 한옥체험관"}</h3>
                <p>
                  {"관아의 기품이 서린 한옥에서 즐기는 가장 안동다운 휴식. 창호지 문 사이로 스며드는 달빛과 고요한 호수 바람이 어우러지는 하룻밤을 선사합니다."}
                </p>
                <button
                  style={{
                    marginTop: "30px",
                    padding: "12px 30px",
                    background: "var(--text)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  {"숙박 정보 확인하기"}
                </button>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="yekki-section" id="info">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
          <div>
            <h2>{"Traveler's Note"}</h2>
            <p>{"예끼마을 여정을 위한 실용 정보"}</p>
            <div
              style={{
                marginTop: "40px",
                borderTop: "1px solid var(--line)",
                paddingTop: "20px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>
                {"찾아오기"}
              </strong>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {"안동역(KTX)에서 급행 3번 버스 이용 시 약 45분 소요. 주차 공간은 마을 입구와 문화단지 내에 넉넉히 마련되어 있습니다."}
              </p>
            </div>
            <div
              style={{
                marginTop: "30px",
                borderTop: "1px solid var(--line)",
                paddingTop: "20px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "10px" }}>
                {"먹거리"}
              </strong>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {"마을 내 '예끼식당', '선성현 식당' 등에서 정갈한 한식과 향토 음식을 즐길 수 있습니다."}
              </p>
            </div>
          </div>
          <div>
            <div
              style={{
                background: "white",
                padding: "40px",
                border: "0.5px solid var(--line)",
                boxShadow: "var(--shadow)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{"추천 연계 코스"}</h3>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>
                {"예끼마을은 도산서원과 4km 거리에 위치해 있어 함께 둘러보기에 최적입니다."}
              </p>
              <ul style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: 2 }}>
                <li>{"예끼마을 도착 & 선성수상길 산책"}</li>
                <li>{"마을 내 갤러리 및 벽화 탐방"}</li>
                <li>{"도산서원 이동 & 유교 문화 체험"}</li>
                <li>{"한국국학진흥원 유교문화박물관"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="yekki-footer">
        <p>{"© 2026 안동 예끼마을 - 전통과 예술이 공존하는 길"}</p>
        <Link href="/">{"메인 페이지로 돌아가기"}</Link>
      </footer>
    </>
  )
}
