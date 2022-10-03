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
				if (req.method === "GET") {
					const accounts = await prisma.moneyAccount.findMany({
						where: {
							userId: user.id,
						},
					});
					res.status(201).send(accounts);
				}
				if (req.method === "POST") {
					const accountBody = req.body;
					const account = await prisma.moneyAccount.create({
						data: {
							...accountBody,
							userId: user.id,
						},
					});
					res.status(201).send(account);
				}
				if (req.method === "PUT") {
					const accountBody = req.body;
					const account = await prisma.moneyAccount.update({
						data: {
							name: accountBody.name,
							bankName: accountBody.bankName,
							description: accountBody.description,
							balance: accountBody.balance,
						},
						where: {
							id: accountBody.id,
						},
					});
					res.status(201).send(account);
				}
			}
		}
	} catch (err) {
		console.error("Accounts API Error", err);
		res.status(500).send(err);
	}
}
