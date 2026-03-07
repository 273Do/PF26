import { gql } from "graphql-request";

const repositoryStatsQuery = gql`
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      issues(states: [OPEN, CLOSED]) {
        totalCount
      }
      pullRequests(states: [OPEN, CLOSED, MERGED]) {
        totalCount
      }
      refs(refPrefix: "refs/heads/") {
        totalCount
      }
      defaultBranchRef {
        target {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
      }
      collaborators {
        totalCount
      }
    }
  }
`;

export type RepositoryStatsObj = {
  repositoryStats: {
    /**
     * issue数
     */
    issues: number;
    /**
     * PR数
     */
    pullRequests: number;
    /**
     * branches数
     */
    branches: number;
    /**
     * commit数
     */
    commits: number;
    /**
     * contributors数
     */
    contributors: number;
  } | null;
};

/**
 * @param githubLink GitHubリンク
 */
export const getRepositoryStats = async (
  githubLink: string | undefined,
): Promise<RepositoryStatsObj> => {
  if (!githubLink) return { repositoryStats: null };

  // URLからownerとnameを抽出
  const match = githubLink.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return { repositoryStats: null };

  const owner = match[1];
  const name = match[2];

  const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

  // API リクエスト
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: repositoryStatsQuery,
      variables: { owner, name },
    }),
  });

  const res = await response.json();

  if (!res.data?.repository) return { repositoryStats: null };

  const { issues, pullRequests, refs, defaultBranchRef, collaborators } =
    res.data.repository;

  return {
    repositoryStats: {
      issues: issues.totalCount,
      pullRequests: pullRequests.totalCount,
      branches: refs.totalCount,
      commits: defaultBranchRef.target.history.totalCount,
      contributors: collaborators.totalCount,
    },
  };
};
