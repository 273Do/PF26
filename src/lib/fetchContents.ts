import fetchApi from "./strapi";
import type { components } from "../../types/schema";

export type AboutObj = components["schemas"]["About"];

export const fetchAbout = async () => {
  try {
    const about = await fetchApi<AboutObj>({
      endpoint: "about",
      wrappedByKey: "data",
    });

    return { about };
  } catch (error) {
    console.error("Failed to fetch about:", error);
    return { about: null };
  }
};

export type WorkObj = components["schemas"]["Work"];

export const fetchWorks = async () => {
  try {
    const works = await fetchApi<WorkObj[]>({
      endpoint: "works",
      wrappedByKey: "data",
      query: { "sort[0]": "releaseDate:desc", "populate[tags]": "*" },
    });

    const count = works?.length || 0;

    return { works: works || null, count };
  } catch (error) {
    console.error("Failed to fetch works:", error);
    return { works: null, count: 0 };
  }
};

export const fetchWork = async (documentId: string) => {
  try {
    const workDetails = await fetchApi<WorkObj>({
      endpoint: `works/${documentId}`,
      wrappedByKey: "data",
      query: {
        "populate[tags][populate]": "*",
        "populate[technologies][populate]": "*",
      },
    });

    return { workDetails };
  } catch (error) {
    console.error(`Failed to fetch work ${documentId}:`, error);
    return { workDetails: null };
  }
};
