import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<Flex
			direction="column"
			p="48px"
			pb="30px"
			rounded="md"
			bg="gray.200/10"
			justify="space-between"
			hideBelow="lg"
		>
            {children}
        </Flex>
	);
};

export default Layout;
