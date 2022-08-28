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
			if (!email) res.status(402).json({ message: "No email" });
			else {
				await prisma.$connect();
				const tags = await prisma.tag.findMany({
					where: {
						user: {
							email,
						},
					},
				});

				res.json(tags);
			}
		}
	} catch (e) {
		console.log(e);

		res.status(509).json({ message: "Server error" });
	} finally {
	}
}
