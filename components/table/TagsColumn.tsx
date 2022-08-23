import { Tag, Wrap } from "@chakra-ui/react";
import { useContext } from "react";
import { DataContext } from "../../pages/table-view";

function TagsColumn({ tagIds }: { tagIds: string[] }) {
	const { tags } = useContext(DataContext);
	return (
		<>
			<Wrap>
				{tagIds.map((tagId) => {
					return (
						<Tag colorScheme="blue" key={tagId}>
							{tags.find((tag) => tag.id === tagId)?.name || "INVALID"}
						</Tag>
					);
				})}
			</Wrap>
		</>
	);
}

export default TagsColumn;
