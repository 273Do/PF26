import fetchApi from "./strapi";
import type { components } from "../../types/schema";

export type AboutObj = components["schemas"]["About"];

export const fetchAbout = async () => {
  const about = await fetchApi<AboutObj>({
    endpoint: "about",
    wrappedByKey: "data",
  });

  return { about };
};

export type WorkObj = components["schemas"]["Work"];

export const fetchWorks = async () => {
  const works = await fetchApi<WorkObj[]>({
    endpoint: "works",
    wrappedByKey: "data",
    query: { "sort[0]": "releaseDate:desc", "populate[tags]": "*" },
  });

  const count = works.length;

  return { works, count };
};

export const fetchWork = async (documentId: string) => {
  const workDetails = await fetchApi<WorkObj>({
    endpoint: `works/${documentId}`,
    wrappedByKey: "data",
    query: {
      "populate[tags][populate]": "*",
      "populate[technologies][populate]": "*",
    },
  });

  return { workDetails };
};
