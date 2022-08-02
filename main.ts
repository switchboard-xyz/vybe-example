import fetch, { Response } from "node-fetch";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

async function doQuery(query: string): Promise<any> {
  const response = await fetch("https://api.vybenetwork.com/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: "b65fcbef-ead9-4893-86a1-28c12e43b59f",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  return response.json();
}

async function getLeaseFund() {
  let query = ` {
    switchboard_switchboard_v2_m_events(
      where: {name: {_eq: "LeaseFundEvent"}, blockTime: {_gt: "1656637200", _lt: "1659315600"}}
    ) {
      blockTime
      data
    }
  }  
  `;
  let res = await doQuery(query);
  let count = 0;
  const sumWithInitial = res.data.switchboard_switchboard_v2_m_events.map(
    (entry: any) => {
      count += +entry.data.amount;
    }
  );
  console.log(
    `Total entries returned: ${res.data.switchboard_switchboard_v2_m_events.length}`
  );
  console.log("Total SOL SPENT : ", count / LAMPORTS_PER_SOL);
}

getLeaseFund().then(
  () => {
    process.exit();
  },
  (err) => {
    process.exit(0);
  }
);
