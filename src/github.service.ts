import axios from "axios";

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
}


export async function fetchResponse(org: string): Promise<GithubRepo[]> {
  const {data} = await axios.get<GithubRepo[]>(
    `https://api.github.com/orgs/${org}/repos`
  );

  return data
}