import Link from "next/link"
import { HeroSlider } from "@/components/hero-slider"
import { RevealSection } from "@/components/reveal-section"
import { ScrollButton } from "@/components/scroll-button"

export default function HomePage() {
  return (
    <>
      <header>
        <div className="nav">
          <div className="logo">
            <span className="logo-stamp">
              <span>{"안"}</span>
              <span>{"동"}</span>
            </span>
            ANDONG
          </div>
          <nav className="nav-links">
            <a href="#highlights">{"장면"}</a>
            <a href="#spots">{"명소"}</a>
            <a href="#yekki">{"예끼마을"}</a>
            <a href="#food">{"음식"}</a>
            <a href="#festival">{"축제"}</a>
            <a href="#plan">{"여정"}</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <div className="hero-bg-wrapper">
          <HeroSlider />
          <section className="hero hero-container">
            <div className="hero-copy reveal show">
              <div className="tagline">{"낙동강을 품은 한국 정신문화의 수도"}</div>
              <h1>
                {"시간이 머무는 도시,"}
                <br />
                <span>{"안동"}</span>{" "}
                <span className="hero-vertical-title">{"安東(안동)"}</span>
              </h1>
              <p>
                {"세계유산 하회마을과 서원, 여름이면 새파란 하늘과 낙동강 바람이 어우러진 풍경, 깊은 맛의 찜닭과 소주, 가을 탈춤의 열기까지. 하루가 다른 결이 되어 기억되는 여행을 시작해 보세요."}
              </p>
              <div className="cta">
                <ScrollButton targetId="plan" className="btn btn-primary">
                  {"여행 계획하기"}
                </ScrollButton>
                <ScrollButton targetId="festival" className="btn btn-secondary">
                  {"축제 바로보기"}
                </ScrollButton>
              </div>
            </div>
            <div className="hero-card reveal show">
              <small style={{ color: "var(--accent)", letterSpacing: "2px" }}>{"TODAY'S MOOD"}</small>
              <h3
                style={{
                  color: "var(--text)",
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "28px",
                  margin: "10px 0",
                }}
              >
                {"오늘의 안동"}
              </h3>
              <p style={{ color: "#666", fontSize: "15px" }}>
                {"맑은 날의 푸른 물빛과 하얀 구름, 오후엔 월영교 아래로 반짝이는 햇살이 이어지는 정갈한 하루입니다."}
              </p>
              <div className="pill-row" style={{ marginTop: "24px" }}>
                <span className="pill">{"하회마을 산책"}</span>
                <span className="pill">{"월영교 야경"}</span>
                <span className="pill">{"전통주 체험"}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Wolyeonggyo Photo */}
        <section className="section">
          <h2>{"월영교 한여름 포토"}</h2>
          <p className="lead">
            {"푸른 낙동강 위로 뻗은 나무다리, 분수 안개와 새하얀 구름이 겹치는 여름 낮의 월영교."}
          </p>
          <RevealSection>
            <figure className="photo-panel" aria-label="월영교 전경 사진">
              <div className="img" />
              <figcaption>
                <div className="badge">Wolyeonggyo</div>
                <div>
                  <strong>{"월영교 & 분수"}</strong>
                  <br />
                  <small>{"낙동강·벚꽃길·분수 야경이 이어지는 안동의 대표 포토 스팟"}</small>
                </div>
              </figcaption>
            </figure>
          </RevealSection>
        </section>

        {/* Highlights - Bento Grid */}
        <section className="section" id="highlights">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "42px", marginBottom: "12px" }}>
              {"정취(情趣): 안동의 장면"}
            </h2>
            <p className="lead" style={{ maxWidth: "600px", margin: "0 auto" }}>
              {"세계유산의 고요함과 살아있는 전통이 만들어내는 조화."}
            </p>
          </div>
          <div className="bento-grid">
            <RevealSection className="bento-card large">
              <div
                className="bg-img"
                style={{ backgroundImage: "url('/assets/hero_hahoe.png')" }}
              />
              <div className="bento-card-content">
                <small style={{ color: "var(--accent)", fontWeight: 700 }}>
                  UNESCO WORLD HERITAGE
                </small>
                <h3>{"하회마을"}</h3>
                <p>
                  {"선비들이 숨쉬던 종가와 초가가 고스란히 남아있는 강마을. 부용대에서 내려다보는 S자 물길이 압권입니다."}
                </p>
              </div>
            </RevealSection>

            <RevealSection className="bento-card wide">
              <div
                className="bg-img"
                style={{ backgroundImage: "url('/assets/wolyeonggyo.jpg')" }}
              />
              <div className="bento-card-content">
                <small style={{ color: "#ffda79", fontWeight: 700 }}>PHOTO SPOT</small>
                <h3>{"월영교 \u00B7 낙강 물길"}</h3>
                <p>
                  {"낙동강을 가르는 나무다리 위 야경, 주변을 잇는 자전거길과 카페. 밤이면 수면에 켜지는 빛이 몽환적입니다."}
                </p>
              </div>
            </RevealSection>

            <RevealSection className="bento-card tall">
              <div
                className="bg-img"
                style={{ backgroundImage: "url('/assets/seowon.png')" }}
              />
              <div className="bento-card-content">
                <small style={{ color: "#55efc4", fontWeight: 700 }}>
                  CONFUCIAN ACADEMY
                </small>
                <h3>{"도산\u00B7병산서원"}</h3>
                <p>
                  {"이황과 유림의 숨결을 느낄 수 있는 강변 서원. 대나무 숲길과 목재 건축의 고요함을 즐겨보세요."}
                </p>
              </div>
            </RevealSection>

            <RevealSection className="bento-card">
              <div
                className="bg-img"
                style={{
                  backgroundImage:
                    "url('/assets/soju.png'), linear-gradient(135deg, #2c3e50, #34495e)",
                }}
              />
              <div className="bento-card-content">
                <small style={{ color: "#fab1a0", fontWeight: 700 }}>
                  TRADITIONAL LIQUOR
                </small>
                <h3>{"안동소주"}</h3>
                <p>
                  {"700년 역사를 이어온 증류식 소주. 깊은 향과 깔끔한 목넘김을 경험해 보세요."}
                </p>
              </div>
            </RevealSection>

            <RevealSection className="bento-card">
              <div
                className="bg-img"
                style={{
                  backgroundImage:
                    "url('/assets/jjimdak.png'), linear-gradient(135deg, #d35400, #e67e22)",
                }}
              />
              <div className="bento-card-content">
                <small style={{ color: "white", fontWeight: 700 }}>LOCAL DELICACY</small>
                <h3>{"안동찜닭"}</h3>
                <p>
                  {"매콤달콤한 간장 양념과 푸짐한 당면의 조화. 구시장의 활기를 맛으로 느껴보세요."}
                </p>
              </div>
            </RevealSection>

            <Link href="/yekki" style={{ textDecoration: "none" }}>
              <RevealSection className="bento-card wide" id="yekki">
                <div className="bento-card-link-hint">{"더 알아보기 \u2192"}</div>
                <div
                  className="bg-img"
                  style={{
                    backgroundImage: "url('/assets/yekki_village.jpg')",
                    filter: "brightness(0.7) sepia(0.3)",
                  }}
                />
                <div className="bento-card-content">
                  <small style={{ color: "#ffda79", fontWeight: 700 }}>
                    {"ART & TRADITION"}
                  </small>
                  <h3>{"예끼마을"}</h3>
                  <p>
                    {"수몰된 역사를 예술로 승화시키다. 안동호의 물길을 걷는 선성수상길과 예술 창작촌의 조화."}
                  </p>
                </div>
              </RevealSection>
            </Link>
          </div>
        </section>

        {/* Spots */}
        <section className="section" id="spots">
          <div className="columns">
            <div>
              <h2>{"가볼 만한 곳"}</h2>
              <p className="lead">
                {"하루면 아쉽고, 이틀이면 깊어지는 동선. 전통과 자연을 엮어 이동 시간을 줄인 추천 코스입니다."}
              </p>
              <div className="tiles">
                <div className="tile">
                  <div className="badge">{"전통"}</div>
                  <strong>{"하회마을 \u2192 병산서원 \u2192 부용대"}</strong>
                  <p>{"강변 드라이브로 연결되는 유네스코 라인. 오후엔 부용대에서 노을."}</p>
                </div>
                <div className="tile">
                  <div className="badge">{"야경"}</div>
                  <strong>{"월영교 \u2192 낙동강 음악분수"}</strong>
                  <p>{"저녁 산책 코스. 다리 아래 반영을 꼭 카메라에 담아보세요."}</p>
                </div>
                <div className="tile">
                  <div className="badge">{"예술"}</div>
                  <strong>{"선성수상길 \u2192 예끼마을 \u2192 도산서원"}</strong>
                  <p>
                    {"물 위를 걷는 부교와 벽화 거리. 도산서원과 4km 거리로 연계 관광 추천."}
                  </p>
                </div>
              </div>
            </div>
            <div className="card" style={{ marginTop: "12px" }}>
              <small>TIP</small>
              <h3>{"안동 이동 꿀팁"}</h3>
              <ul style={{ paddingLeft: "18px", margin: "8px 0 12px", color: "#2f4a63" }}>
                <li>
                  {"안동역(중앙선)\u00B7안동버스터미널이 도심 중심. 시내버스 노선이 하회\u00B7서원까지 연결."}
                </li>
                <li>{"렌터카 이용 시 하회마을 주차장 \u2192 셔틀버스 환승 필수."}</li>
                <li>
                  {"주요 관광지는 17~30km 이내, 1시간 안팎 드라이브로 이어집니다."}
                </li>
              </ul>
              <div className="map-box">
                <p>
                  {"도심 \u2194 하회: 약 25km / 35분 \u00B7 도심 \u2194 월영교: 약 3km / 10분"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Food */}
        <section className="section" id="food">
          <h2>{"안동의 맛"}</h2>
          <p className="lead">
            {"깊게 우린 간장과 통닭을 찜으로 끓여낸 찜닭, 세 번 증류한 소주, 강에서 건너온 민물매운탕까지."}
          </p>
          <div className="grid">
            <RevealSection className="card">
              <div
                className="card-img"
                style={{ backgroundImage: "url('/assets/jjimdak.png')" }}
              />
              <small>{"시장"}</small>
              <h3>{"안동찜닭"}</h3>
              <p>
                {"구시장 골목마다 다른 비율의 간장 양념과 매운맛 커스터마이즈. 볶음밥까지가 공식입니다."}
              </p>
              <div className="chips">
                <span className="chip">{"구시장"}</span>
                <span className="chip">{"저염 간장맛"}</span>
                <span className="chip">{"중간 매운맛 추천"}</span>
              </div>
            </RevealSection>
            <RevealSection className="card">
              <div
                className="card-img"
                style={{ backgroundImage: "url('/assets/soju.png')" }}
              />
              <small>{"주류"}</small>
              <h3>{"안동소주"}</h3>
              <p>
                {"증류식 소주 체험장과 갤러리에서 숙성 과정 견학 가능. 전통주 바에서 페어링 메뉴도 즐길 수 있어요."}
              </p>
              <div className="chips">
                <span className="chip">{"40도 전통 레시피"}</span>
                <span className="chip">{"칵테일 바"}</span>
                <span className="chip">{"주류 박물관"}</span>
              </div>
            </RevealSection>
            <RevealSection className="card">
              <div
                className="card-img"
                style={{ backgroundImage: "url('/assets/heotjesabap.png')" }}
              />
              <small>{"강\u00B7산"}</small>
              <h3>{"국시\u00B7헛제사밥"}</h3>
              <p>
                {"제사상을 재현한 헛제사밥과 유기농 밀가루로 뽑은 안동국시. 깔끔한 국물과 채소 토핑이 특징입니다."}
              </p>
              <div className="chips">
                <span className="chip">{"근대골목"}</span>
                <span className="chip">{"채식 곁들이기 쉬움"}</span>
              </div>
            </RevealSection>
          </div>
          <div className="stat-band">
            <div className="stat">
              <strong>{"찜닭 골목 50+"}</strong>
              <span>{"가게마다 매운맛\u00B7당도 조절 가능"}</span>
            </div>
            <div className="stat">
              <strong>{"전통주 10+"}</strong>
              <span>{"양조장 투어, 소주\u00B7막걸리 테이스팅"}</span>
            </div>
            <div className="stat">
              <strong>{"야시장"}</strong>
              <span>{"주말 플리마켓과 먹거리 부스"}</span>
            </div>
          </div>
        </section>

        {/* Festival */}
        <section className="section" id="festival">
          <h2>{"축제 & 이벤트"}</h2>
          <p className="lead">
            {"가을 탈춤, 봄 벚꽃, 여름 물놀이까지 계절마다 다른 무드를 선택해 보세요."}
          </p>
          <div className="timeline">
            <RevealSection className="timeline-item">
              <div
                className="card-img"
                style={{
                  backgroundImage: "url('/assets/mask_dance.png')",
                  height: "160px",
                }}
              />
              <strong>{"안동국제탈춤페스티벌"}</strong>
              <br />
              {"2025년 9월 말 ~ 10월 초 (예정)"}
              <br />
              <small>{"도심\u00B7하회마을 일대"}</small>
              <p>{"국내외 탈춤 공연, 거리 퍼레이드, 야간 불꽃, 체험부스."}</p>
            </RevealSection>
            <RevealSection className="timeline-item">
              <div
                className="card-img"
                style={{
                  backgroundImage: "url('/assets/andong-moonlight-dzrsh.png')",
                  height: "160px",
                }}
              />
              <strong>{"월영야행"}</strong>
              <br />
              {"7~8월 주말"}
              <br />
              <small>{"월영교 주변"}</small>
              <p>{"야간 조명, 낙동강 버스킹, 전통등 전시."}</p>
            </RevealSection>
            <RevealSection className="timeline-item">
              <div
                className="card-img"
                style={{
                  backgroundImage: "url('/assets/cherry_blossom.png')",
                  height: "160px",
                }}
              />
              <strong>{"서원 연꽃\u00B7벚꽃 시즌"}</strong>
              <br />
              {"3~4월"}
              <br />
              <small>{"병산\u00B7도산서원"}</small>
              <p>{"강변 벚꽃길, 새벽 물안개 포토 스팟."}</p>
            </RevealSection>
          </div>
          <div className="chips" style={{ marginTop: "14px" }}>
            <span className="chip">{"축제 일정은 매년 업데이트"}</span>
            <span className="chip">{"사전 예매 여부 확인"}</span>
            <span className="chip">{"주차\u00B7셔틀 버스 정보 체크"}</span>
          </div>
        </section>

        {/* Travel Planner */}
        <section className="section" id="plan">
          <hr
            style={{
              border: "none",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, var(--line), transparent)",
              marginBottom: "80px",
            }}
          />
          <div className="columns">
            <div style={{ gridColumn: "span 2" }}>
              <h2>{"여행 플래너"}</h2>
              <p className="lead">
                {"안동역\u00B7터미널 기준으로 이동 시간을 최적화한 제안입니다."}
              </p>
              <div className="grid">
                <RevealSection
                  className="card"
                >
                  <div style={{ background: "rgba(42, 143, 216, 0.05)", borderLeft: "4px solid var(--accent)", padding: "24px", margin: "-24px", borderRadius: "var(--bento-radius)" }}>
                    <small>Day Trip</small>
                    <h3 style={{ color: "var(--accent-2)" }}>{"하루 코스"}</h3>
                    <ul
                      style={{
                        paddingLeft: "18px",
                        margin: "8px 0",
                        color: "#2f4a63",
                      }}
                    >
                      <li>{"오전: 하회마을 투어 & 부용대 뷰"}</li>
                      <li>{"점심: 하회\u00B7도산 인근 향토식당"}</li>
                      <li>{"오후: 병산서원 산책 후 도심 이동"}</li>
                      <li>{"저녁: 찜닭 골목 \u2192 월영교 야경"}</li>
                    </ul>
                  </div>
                </RevealSection>
                <RevealSection
                  className="card"
                >
                  <div style={{ background: "rgba(15, 111, 182, 0.05)", borderLeft: "4px solid var(--accent-2)", padding: "24px", margin: "-24px", borderRadius: "var(--bento-radius)" }}>
                    <small>Weekend</small>
                    <h3 style={{ color: "var(--accent-2)" }}>{"1박 2일"}</h3>
                    <ul
                      style={{
                        paddingLeft: "18px",
                        margin: "8px 0",
                        color: "#2f4a63",
                      }}
                    >
                      <li>{"1일차: 하회\u00B7서원 라인, 도심 시장 탐방"}</li>
                      <li>{"숙박: 한옥 스테이 또는 강변 호텔"}</li>
                      <li>{"2일차: 월영교 아침 산책, 전통주 체험, 공예 쇼핑"}</li>
                    </ul>
                  </div>
                </RevealSection>
                <RevealSection
                  className="card"
                >
                  <div style={{ background: "rgba(95, 195, 170, 0.05)", borderLeft: "4px solid #2ecc71", padding: "24px", margin: "-24px", borderRadius: "var(--bento-radius)" }}>
                    <small>Slow</small>
                    <h3 style={{ color: "var(--accent-2)" }}>{"로컬 머무르기"}</h3>
                    <ul
                      style={{
                        paddingLeft: "18px",
                        margin: "8px 0",
                        color: "#2f4a63",
                      }}
                    >
                      <li>{"전통마을 스테이 & 서원 서점 탐방"}</li>
                      <li>{"낙동강 자전거길 \u00B7 강변 카페"}</li>
                      <li>{"주말 플리마켓, 공방 클래스"}</li>
                    </ul>
                  </div>
                </RevealSection>
              </div>
            </div>
            <RevealSection
              className="card"
            >
              <div
                style={{
                  background: "var(--text)",
                  color: "white",
                  padding: "32px",
                  margin: "-24px",
                  borderRadius: "var(--bento-radius)",
                }}
              >
                <small style={{ color: "var(--accent)" }}>{"실용 정보"}</small>
                <h3 style={{ color: "white", fontSize: "24px" }}>
                  {"찾아오기 \u00B7 돌아가기"}
                </h3>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: "16px 0 20px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <li style={{ marginBottom: "8px" }}>
                    {"철도: 중앙선(무궁화\u00B7ITX) 이용, 안동역 하차."}
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    {"버스: 서울(동서울\u00B7남부터미널), 대구, 부산 등 직행 운영."}
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    {"급행 3번: 안동역(KTX) \u2194 예끼마을\u00B7도산서원 (약 45분 소요)."}
                  </li>
                  <li style={{ marginBottom: "8px" }}>
                    {"시내버스: 하회마을\u00B7서원\u00B7찜닭골목 정류장 다수."}
                  </li>
                  <li>
                    {"택시/렌터카: 도심 렌터카 지점 활용, 주차장\u00B7셔틀 확인."}
                  </li>
                </ul>
                <div className="chips">
                  <span
                    className="chip"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {"관광안내소: 안동역 앞"}
                  </span>
                  <span
                    className="chip"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {"1330 관광안내"}
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="footer-links">
          <span>{"참고: 안동시청, 투어안동, 고향사랑기부제, 나무위키"}</span>
          <a
            href="https://www.andong.go.kr/main.do"
            target="_blank"
            rel="noreferrer"
          >
            {"안동시청"}
          </a>
          <a
            href="https://www.tourandong.com/public/"
            target="_blank"
            rel="noreferrer"
          >
            {"투어안동"}
          </a>
          <a
            href="https://www.ilovegohyang.go.kr/goods/searchGoods-main.html?type=L&locgov=47170"
            target="_blank"
            rel="noreferrer"
          >
            {"고향사랑 기부"}
          </a>
          <a
            href="https://namu.wiki/w/%EC%95%88%EB%8F%99%EC%8B%9C"
            target="_blank"
            rel="noreferrer"
          >
            {"나무위키"}
          </a>
        </div>
        <p style={{ marginTop: "12px" }}>
          {"전통의 질감을 살린 감성으로, 여행자가 바로 활용할 수 있는 큐레이션을 담았습니다."}
        </p>
      </footer>
    </>
  )
}
