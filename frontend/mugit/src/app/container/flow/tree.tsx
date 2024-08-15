"use client";

import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Loading from "@/app/components/loading";
import Error from "@/app/components/error";
import useAsync from "@/app/hooks/useAsync";
import { getFlowGraph } from "@/app/libs/flowReadApi";
import { useParams } from "next/navigation";

export default function Tree() {
  const params = useParams<{ id: string }>();
  const [state, refetch] = useAsync(() => getFlowGraph(params.id), []);
  const { loading, data: flowGraph, error } = state;

  useLayoutEffect(() => {
    if (!flowGraph || loading || error) return;

    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    var series = root.container.children.push(
      am5hierarchy.ForceDirected.new(root, {
        downDepth: 1,
        initialDepth: 10,
        topDepth: 0,
        // valueField: "value",
        categoryField: "name",
        childDataField: "childFlows",
        xField: "x",
        yField: "y",
        minRadius: 30,
        manyBodyStrength: -40,
      })
    );

    // Disable circles
    // series.circles.template.set("forceHidden", true);
    // series.outerCircles.template.set("forceHidden", true);

    // Set up labels
    series.labels.template.setAll({
      fill: am5.color(0x000000),
      y: 45,
      //y: am5.percent(10),
      oversizedBehavior: "none",
    });

    series.nodes.template.setup = function (target) {
      target.events.on("dataitemchanged", function (ev) {
        const container = target.children.push(
          am5.Container.new(root, {
            width: 80,
            height: 80,
            centerX: am5.percent(0),
            centerY: am5.percent(0),
          })
        );

        const circleMask = container.children.push(
          am5.Circle.new(root, {
            radius: 40,
            centerX: am5.percent(50),
            centerY: am5.percent(50),
          })
        );

        container.set("mask", circleMask);
        let imageSrc = (ev.target.dataItem?.dataContext as any)?.image;

        if (imageSrc) {
          var icon = container.children.push(
            am5.Picture.new(root, {
              width: 80,
              height: 80,
              centerX: am5.percent(50),
              centerY: am5.percent(50),
              src: imageSrc,
              wheelable: true,
            })
          );
        }
      });
    };

    series.data.setAll([flowGraph]);

    // series.data.setAll([
    //   {
    //     name: "Browsers",
    //     image: "/person.jpg",
    //     x: am5.percent(50),
    //     y: am5.percent(50),
    //     children: [
    //       {
    //         name: "Chrome",
    //         value: 1,
    //         image: "/Rectangle 35.png",
    //       },
    //       {
    //         name: "Firefox",
    //         value: 1,
    //         image: "/Rectangle 35.png",
    //       },
    //       {
    //         name: "Firefox",
    //         value: 1,
    //         image: "/Rectangle 35.png",
    //       },
    //       {
    //         name: "Firefox",
    //         value: 1,
    //         image: "/Rectangle 35.png",
    //       },
    //       {
    //         name: "HHHHHHHH",
    //         value: 1,
    //         image: "/Rectangle 35.png",
    //         children: [
    //           {
    //             name: "Chrome",
    //             value: 1,
    //             image: "/Rectangle 35.png",
    //           },
    //           {
    //             name: "Firefox",
    //             value: 1,
    //             image: "/Rectangle 35.png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ]);

    series.set("selectedDataItem", series.dataItems[0]);

    return () => {
      root.dispose();
    };
  }, [flowGraph, loading, error]);

  return <div id="chartdiv" style={{ width: "900px", height: "500px" }}></div>;
}
