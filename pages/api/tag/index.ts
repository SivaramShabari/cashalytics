import { Tag } from "@prisma/client";
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
			console.log("No session in category/all");
			res.status(401).json({ message: "Unauthorized" });
		} else {
			const email = session.user?.email;
			const user = await prisma.user.findUnique({
				where: { email: email || "" },
			});
			if (!user) res.status(402).json({ message: "Unauthorized user details" });
			else {
				if (req.method === "POST") {
					const name = req.body.name;
					const tag = await prisma.tag.create({
						data: {
							name: name,
							userId: user.id,
						},
					});

					res.status(201).send(tag);
				} else if (req.method === "PUT") {
					const tag = req.body;
					console.log("PUT TAG", tag);
					await prisma.tag.update({
						data: { name: tag.name },
						where: { id: tag.id },
					});

					res.status(201).send(tag);
				} else if (req.method === "DELETE") {
					const id = (req.query.id as string) || "";
					const allTransactions = await prisma.transaction.findMany({
						where: {
							userId: user.id,
							tags: {
								hasEvery: [id],
							},
						},
					});
					await prisma.$transaction(
						allTransactions.map((t) => {
							return prisma.transaction.update({
								where: {
									id: t.id,
								},
								data: {
									tags: t.tags.filter((tag) => tag != id),
								},
							});
						})
					);
					await prisma.tag.delete({ where: { id: id as string } });
					res.status(200).send("Deleted tag");
				}
			}
		}
	} catch (err) {
		res.status(500).send(err);
		console.log("Error", err);
	} finally {
	}
}
