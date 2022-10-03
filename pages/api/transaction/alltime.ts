import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { filters } from "../../../types/filter";
import prisma from "../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (!session) {
      console.error("No session in category/all");
      res.status(401).json({ message: "Unauthorized" });
    } else {
      if (req.method === "GET") {
        const debit = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            user: { email: session.user?.email || "" },
            type: "Debit",
          },
        });
        const credit = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            user: { email: session.user?.email || "" },
            type: "Credit",
          },
        });
        res.status(201).send({ credit, debit });
      }
    }
  } catch (err) {}
}
