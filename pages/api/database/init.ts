import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../public/190822_data.json";
import { getSession } from "next-auth/react";
import prisma from "../prisma";
const data1 = data.slice(0, 200);
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method === "GET") {
			const session = await getSession({ req });

			if (!session) res.status(401).json({ message: "Unauthorized" });
			else {
				await prisma.$connect();
				const user = await prisma.user.findUnique({
					where: {
						email: session.user?.email || undefined,
					},
				});
				if (!user) res.status(402).json({ message: "No user" });
				else {
					const tagNames = [
						"Tax",
						"EMI",
						"Food",
						"Fuel",
						"Gift",
						"Fuel",
						"Travel",
						"Vehicle",
						"Medical",
						"Entertainment",
					];
					const unknownTag = await prisma.tag.create({
						data: {
							name: "Unknown",
							userId: user.id,
						},
					});
					await prisma.tag.createMany({
						data: tagNames.map((name) => ({
							name,
							userId: user.id,
						})),
					});
					prisma.$disconnect();
					res.status(200).json({ message: "Database initialized" });
				}
			}
		}
	} catch (e) {
		console.log(e);
		prisma.$disconnect();
		res.status(509).json({ message: "Server error" });
	}
}
