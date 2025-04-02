import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import jeayBackdrop from "@/assets/jeay-backdrop.svg";
import jeayBackdropDark from "@/assets/jeay-backdrop-dark.svg";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<Flex
			direction="column"
			display={{ base: "none", lg: "flex" }}
			p="48px"
			pb="30px"
			rounded="lg"
			bgColor="surface"
			justify="space-between"
			bgImage={{
				base: `url("${jeayBackdrop}")`,
				_dark: `url("${jeayBackdropDark}")`,
			}}
			bgRepeat="no-repeat"
			bgAttachment="fixed"
			bgPos="-5% 480px"
			bgSize="35%"
		>
			{children}
		</Flex>
	);
};

export default Layout;
