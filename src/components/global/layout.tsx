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
			rounded="lg"
			bgColor="surface"
			justify="space-between"
			display={{ base: "none", lg: "flex" }}
			bgImage={{ base: "url(../src/assets/jeay-backdrop.svg)", _dark: "url(../src/assets/jeay-backdrop-dark.svg)" }}
			bgRepeat="no-repeat"
			bgPos="60% 480px"
			bgSize="120%"
		>
			{children}
		</Flex>
	);
};

export default Layout;
