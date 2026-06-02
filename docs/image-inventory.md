# 안동 안내 이미지 인벤토리

이 문서는 `assets/site-data.js`와 `docs/source-links.md`를 기준으로 생성한다.
이미지 교체 작업 전후에는 `node scripts/update-image-inventory.mjs`를 실행한다.

- 콘텐츠 수: 31
- 사용 중인 고유 이미지: 27
- 임시 이미지 교체 메모가 있는 콘텐츠: 13

## 임시 이미지 교체 우선순위

| 콘텐츠 | 제목 | 대표 이미지 | 이미지 수 |
|---|---|---|---|
| `food:soju` | 안동소주 | `assets/soju.png` | 5 |
| `food:guksi` | 안동국시 | `assets/andong_guksi.png` | 5 |
| `food:octopus` | 안동 문어 | `assets/andong_octopus.png` | 5 |
| `food:jongga` | 종가음식 | `assets/andong_jongga.png` | 4 |
| `food:market` | 시장 먹거리 | `assets/andong_market.png` | 4 |
| `event:moonlight` | 월영야행 | `assets/andong-moonlight-dzrsh.png` | 4 |
| `event:cherry` | 안동벚꽃축제 | `assets/cherry_blossom.png` | 5 |
| `event:waterfesta` | 안동수페스타 | `assets/wolyeonggyo.png` | 4 |
| `event:ice` | 암산얼음축제 | `assets/andong_ice_festival.png` | 4 |
| `place:byeongsan` | 병산서원 | `assets/seowon.png` | 4 |
| `place:bongjeongsa` | 봉정사 | `assets/andong_bongjeongsa.png` | 4 |
| `place:market-place` | 안동구시장 | `assets/jjimdak.png` | 4 |
| `place:imcheonggak` | 임청각 | `assets/andong_imcheonggak.png` | 5 |

## 이미지 재사용 현황

| 이미지 | 사용 콘텐츠 수 | 사용 콘텐츠 |
|---|---:|---|
| `assets/wolyeonggyo.jpg` | 19 | `food:jjimdak`, `food:soju`, `food:mackerel`, `event:maskdance`, `event:moonlight`, `event:cherry`, `event:waterfesta`, `event:ice`, `place:wolyeonggyo`, `place:byeongsan`, `place:bongjeongsa`, `place:market-place`, `place:imcheonggak`, `place:andongdam`, `course:first-day`, `course:food-course`, `course:night-course`, `course:transit-course`, `course:car-course` |
| `assets/hanokmaul.jpg` | 17 | `food:soju`, `food:heotjesabap`, `food:guksi`, `food:mackerel`, `food:octopus`, `food:jongga`, `event:moonlight`, `event:ice`, `place:hahoe`, `place:wolyeonggyo`, `place:dosan`, `place:byeongsan`, `place:yekki`, `place:susanggil`, `place:imcheonggak`, `course:history-course`, `course:family-course` |
| `assets/jjimdak.png` | 14 | `food:jjimdak`, `food:soju`, `food:guksi`, `food:octopus`, `food:market`, `event:maskdance`, `event:cherry`, `place:market-place`, `course:first-day`, `course:food-course`, `course:festival-course`, `course:night-course`, `course:family-course`, `course:transit-course` |
| `assets/seowon.png` | 11 | `food:heotjesabap`, `food:guksi`, `food:jongga`, `event:ice`, `place:hahoe`, `place:dosan`, `place:byeongsan`, `place:bongjeongsa`, `place:imcheonggak`, `course:first-day`, `course:history-course` |
| `assets/heotjesabap.png` | 10 | `food:jjimdak`, `food:soju`, `food:heotjesabap`, `food:guksi`, `food:mackerel`, `food:octopus`, `food:jongga`, `food:market`, `place:market-place`, `course:food-course` |
| `assets/hero_hahoe.png` | 10 | `event:maskdance`, `event:cherry`, `place:hahoe`, `place:byeongsan`, `course:first-day`, `course:festival-course`, `course:history-course`, `course:family-course`, `course:transit-course`, `course:car-course` |
| `assets/andong-moonlight-dzrsh.png` | 8 | `food:market`, `event:maskdance`, `event:moonlight`, `event:cherry`, `event:waterfesta`, `place:wolyeonggyo`, `course:festival-course`, `course:night-course` |
| `assets/susanggil.jpg` | 6 | `place:dosan`, `place:yekki`, `place:susanggil`, `course:history-course`, `course:transit-course`, `course:car-course` |
| `assets/wolyeonggyo.png` | 6 | `event:moonlight`, `event:waterfesta`, `place:wolyeonggyo`, `place:imcheonggak`, `course:night-course`, `course:family-course` |
| `assets/soju.png` | 4 | `food:soju`, `food:heotjesabap`, `place:market-place`, `course:food-course` |
| `assets/yekki_village.jpg` | 4 | `place:dosan`, `place:yekki`, `place:susanggil`, `course:car-course` |
| `assets/andong_market.png` | 3 | `food:jjimdak`, `food:octopus`, `food:market` |
| `assets/mask_dance.png` | 3 | `event:maskdance`, `place:hahoe`, `course:festival-course` |
| `assets/sunsungmemory.jpg` | 3 | `place:yekki`, `place:susanggil`, `place:andongdam` |
| `assets/andong_susanggil.png` | 2 | `place:susanggil`, `place:andongdam` |
| `assets/cherry_blossom.png` | 2 | `event:cherry`, `event:waterfesta` |
| `assets/andong_bongjeongsa.png` | 1 | `place:bongjeongsa` |
| `assets/andong_dam.png` | 1 | `place:andongdam` |
| `assets/andong_guksi.png` | 1 | `food:guksi` |
| `assets/andong_ice_festival.png` | 1 | `event:ice` |
| `assets/andong_imcheonggak.png` | 1 | `place:imcheonggak` |
| `assets/andong_jongga.png` | 1 | `food:jongga` |
| `assets/andong_mackerel.png` | 1 | `food:mackerel` |
| `assets/andong_octopus.png` | 1 | `food:octopus` |
| `assets/artwall.jpg` | 1 | `place:yekki` |
| `assets/gunmindang.jpg` | 1 | `place:yekki` |
| `assets/yekki_village2.jpg` | 1 | `place:bongjeongsa` |

## 운영 기준

- 대표 이미지가 실제 콘텐츠와 직접 관련 없는 경우 `docs/source-links.md`에 임시 사용 사유를 남긴다.
- 새 전용 이미지를 추가하면 `assets/site-data.js`의 `image`, `richImages`, `richSections[].image`를 함께 검토한다.
- 이미지 파일은 `assets/...` 경로를 사용하고, 사용하지 않는 파일을 추가하지 않는다.
