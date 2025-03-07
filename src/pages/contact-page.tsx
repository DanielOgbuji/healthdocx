import { Stack, Text, Link, Box, Flex, Badge } from "@chakra-ui/react";
import Layout from "../components/global/layout";
import ContactForm from "./contact-form";
import Youtube from "@/assets/youtube.svg";
import Instagram from "@/assets/instagram.svg";
import Linkedin from "@/assets/linkedin.svg";
import Whatsapp from "@/assets/whatsapp.svg";
import X from "@/assets/x.svg";

const ContactPage = () => {
	return (
		<Box display="flex" height="100%" width="100%" gap="12px">
			<Layout>
				<Stack minHeight="440px">
					<Flex
						direction="column"
						gap="2"
						borderBottomWidth="thin"
						borderBottomStyle="dashed"
						pb="4"
					>
						<Text textStyle="lg" fontWeight="bold">
							Email support
						</Text>
						<Text textStyle="sm" color="bg.inverted/32">
							Email us and we&apos;ll get back to you within 24 hours.
						</Text>
						<Link variant="underline" textStyle="sm" href="#">
							support@healthdocx.io
						</Link>
					</Flex>
					<Flex
						direction="column"
						gap="2"
						borderBottomWidth="thin"
						borderBottomStyle="dashed"
						py="4"
					>
						<Text textStyle="lg" fontWeight="bold">
							Chat support
						</Text>
						<Text textStyle="sm" color="bg.inverted/32">
							Chat our staff 24/7 for instant access to support.
						</Text>
						<Flex gap="3">
							<Link variant="underline" textStyle="sm" href="#">
								Start Live Chat
							</Link>
							<Badge
								color="fg.error"
								borderRadius="full"
								bgColor="Background"
								borderColor="bg.muted"
								borderWidth="thin"
								px="2"
							>
								<Text mt="-2px">•</Text> Offline
							</Badge>
						</Flex>
					</Flex>
					<Flex
						direction="column"
						gap="2"
						borderBottomWidth="thin"
						borderBottomStyle="dashed"
						py="4"
					>
						<Text textStyle="lg" fontWeight="bold">
							Call us
						</Text>
						<Text textStyle="sm" color="bg.inverted/32">
							Mon - Sat • 9:00AM - 5:00PM (WAT)
						</Text>
						<Flex direction="column" gap="1">
							<Link variant="underline" textStyle="sm" href="#">
								+234 800 000 0000
							</Link>
							<Link variant="underline" textStyle="sm" href="#">
								+234 700 000 0001
							</Link>
						</Flex>
					</Flex>
					<Flex
						direction="column"
						gap="2"
						py="4"
					>
						<Text
							textStyle="lg"
							fontWeight="bold"
							display="flex"
							alignItems="center"
							gap="2"
						>
							Walk in <Badge>Lagos</Badge>
						</Text>
						<Text textStyle="sm" color="bg.inverted/32">
							Visit our office Mon - Sat • 9:00AM - 5:00PM.
						</Text>
						<Flex gap="2">
							<span className="material-symbols-outlined">location_on</span>
							<Link variant="underline" textStyle="sm" href="#">
								20, Ikeja Street Road, Lagos, Nigeria.
							</Link>
						</Flex>
					</Flex>
				</Stack>
				<Flex gap="3" justifyContent="center">
					<a href="#">
						<img src={Youtube} alt="youtube" width="32px" />
					</a>
					<a href="#">
						<img src={Instagram} alt="instagram" width="32px" />
					</a>
					<a href="#">
						<img src={Linkedin} alt="linkedin" width="32px" />
					</a>
					<a href="#">
						<img src={Whatsapp} alt="whatsapp" width="32px" />
					</a>
					<a href="#">
						<img src={X} alt="X formerly known as twitter" width="32px" />
					</a>
				</Flex>
			</Layout>

			<Stack justifyContent="center" alignItems="center" flexGrow="1">
				<ContactForm
					legendText="Get in touch"
					helperText="Our friendly team would love to hear from you."
				/>
			</Stack>
		</Box>
	);
};

export default ContactPage;
