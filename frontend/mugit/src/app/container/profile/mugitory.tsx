"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import { useParams } from "next/navigation";
import { apiUrl } from "@/app/store/atoms";

export default function Mugitory() {
  const t = useTranslations("Mugitory");
  const params = useParams();
  const now = new Date();
  // const [value, setValue] = useState([
  //   ...[...Array(7)].map((_, idx) => ({
  //     date: `2023/06/${idx + 4}`,
  //     count: 10,
  //   })),
  //   { date: "2023/06/12", count: 10 },
  //   { date: "2023/06/20", count: 10 },
  //   { date: "2023/06/28", count: 10 },
  //   { date: "2023/07/04", count: 10 },
  //   { date: "2023/07/10", count: 10 },
  //   ...[...Array(7)].map((_, idx) => ({
  //     date: `2023/07/${idx + 16}`,
  //     count: 10,
  //   })),
  //   ...[...Array(6)].map((_, idx) => ({
  //     date: `2023/08/${idx + 20}`,
  //     count: 10,
  //   })),
  //   { date: "2023/09/02", count: 10 },
  //   { date: "2023/09/09", count: 10 },
  //   { date: "2023/09/16", count: 10 },
  //   { date: "2023/09/23", count: 10 },
  //   ...[...Array(6)].map((_, idx) => ({
  //     date: `2023/09/${idx + 24}`,
  //     count: 10,
  //   })),
  //   ...[...Array(2)].map((_, idx) => ({
  //     date: `2023/10/${idx + 30}`,
  //     count: 10,
  //   })),
  //   ...[...Array(3)].map((_, idx) => ({
  //     date: `2023/11/${idx + 1}`,
  //     count: 10,
  //   })),
  //   { date: "2023/11/5", count: 10 },
  //   { date: "2023/11/11", count: 10 },
  //   { date: "2023/11/12", count: 10 },
  //   { date: "2023/11/18", count: 10 },
  //   { date: "2023/11/19", count: 10 },
  //   { date: "2023/11/22", count: 10 },
  //   { date: "2023/11/25", count: 10 },
  //   { date: "2023/11/26", count: 10 },
  //   { date: "2023/11/29", count: 10 },
  //   { date: "2023/12/2", count: 10 },
  //   { date: "2023/12/4", count: 10 },
  //   { date: "2023/12/6", count: 10 },
  //   { date: "2023/12/7", count: 10 },
  //   { date: "2023/12/8", count: 10 },
  //   ...[...Array(7)].map((_, idx) => ({
  //     date: `2024/01/${idx + 7}`,
  //     count: 10,
  //   })),
  //   { date: "2024/2/11", count: 10 },
  //   { date: "2024/2/18", count: 10 },
  //   { date: "2024/2/25", count: 10 },
  //   ...[...Array(7)].map((_, idx) => ({
  //     date: `2024/03/${idx + 3}`,
  //     count: 10,
  //   })),
  //   { date: "2024/3/10", count: 10 },
  //   { date: "2024/3/17", count: 10 },
  //   { date: "2024/3/24", count: 10 },
  // ]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    fetch(apiUrl + `/mugitories/users/${params.id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setValue(data.list));
  }, []);
  return (
    <HeatMap
      value={value}
      rectSize={16}
      rectProps={{ rx: 10 }}
      weekLabels={[
        t("sun"),
        t("mon"),
        t("tue"),
        t("wed"),
        t("thu"),
        t("fri"),
        t("sat"),
      ]}
      monthLabels={[
        t("jan"),
        t("feb"),
        t("mar"),
        t("apr"),
        t("may"),
        t("jun"),
        t("jul"),
        t("aug"),
        t("sep"),
        t("oct"),
        t("nov"),
        t("dec"),
      ]}
      startDate={new Date(now.setFullYear(now.getFullYear() - 1))}
      endDate={new Date()}
      className="mx-auto mt-10 h-48 w-2/3"
      rectRender={(props, data) => {
        return (
          <Tooltip
            placement="top"
            content={`${t("date")}: ${data.date} ${t("count")}: ${
              data.count || 0
            }`}
          >
            <rect {...props} />
          </Tooltip>
        );
      }}
    />
  );
}
