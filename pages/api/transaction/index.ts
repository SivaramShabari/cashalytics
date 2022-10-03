import { PrismaPromise, Transaction } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
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
      const email = session.user?.email;
      const user = await prisma.user.findUnique({
        where: { email: email || "" },
      });
      if (!user) res.status(402).json({ message: "Unauthorized user details" });
      else {
        if (req.method === "POST") {
          const transactions = req.body;
          let uniqueAccountId = "";
          transactions.forEach((t: any) => {
            if (uniqueAccountId === "") uniqueAccountId = t.accountId;
            else {
              if (uniqueAccountId !== t.accountId)
                throw new Error(
                  "Accound ID should be same for bulk transaction insertion"
                );
            }
          });
          prisma.$connect();
          let totalTransactionAmount = 0;
          transactions.forEach((t: any) => {
            if (t.type === "Debit") totalTransactionAmount -= t.amount;
            else totalTransactionAmount += t.amount;
          });
          const updates = await prisma.$transaction([
            ...transactions.map((t: any) => {
              return prisma.transaction.create({
                data: { ...t, date: new Date(t.date), userId: user.id },
              });
            }),
            prisma.moneyAccount.update({
              data: {
                balance: {
                  increment: totalTransactionAmount,
                },
              },
              where: {
                id: uniqueAccountId,
              },
            }),
          ]);

          res.status(200).json(updates);
        } else if (req.method === "PUT") {
          const transactions = (req.body as Transaction[]) || [];
          prisma.$connect();
          const updates = await prisma.$transaction(
            transactions.map((t) => {
              let temp: any = {};
              for (const key of Object.keys(t)) {
                if (key !== "id") temp[key] = (t as any)[key];
              }
              return prisma.transaction.update({
                data: { ...temp, date: new Date(temp.date) },
                where: { id: t.id },
              });
            })
          );

          res.status(200).json(updates);
        } else {
          res.status(410).json("Path doesn't exist");
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
}
