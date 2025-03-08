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
						<Link
							variant="underline"
							textStyle="sm"
							href="mailto:support@healthdocx.io"
						>
							support@healthdocx.io
						</Link>
					</Flex>
					<Flex
						direction="column"
						gap="2"
						borderBottomWidth="thin"
						borderBottomStyle="dashed"
						pt="2"
						pb="4"
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
						pt="2"
						pb="4"
					>
						<Text textStyle="lg" fontWeight="bold">
							Call us
						</Text>
						<Text textStyle="sm" color="bg.inverted/32">
							Mon - Sat • 9:00AM - 5:00PM (WAT)
						</Text>
						<Flex direction="row" gap="1">
							<Link
								variant="underline"
								textStyle="sm"
								href="tel:+2348000000000"
							>
								+234 800 000 0000
							</Link>
							,
							<Link
								variant="underline"
								textStyle="sm"
								href="tel:+2347000000001"
							>
								+234 700 000 0001
							</Link>
						</Flex>
					</Flex>
					<Flex direction="column" gap="2" pt="2" pb="4">
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
							<Link
								variant="underline"
								textStyle="sm"
								href="https://maps.app.goo.gl/jiNBdodUFQLuch2XA"
								pb="3"
							>
								13 Dolphine Estate, Ikeja Way, Lagos, NG.
							</Link>
						</Flex>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4895512938538!2d3.413106744107315!3d6.459488576905882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b3565684049%3A0xe564840408c42fc3!2sIkeja%20Way%2C%20Dolphine%20Estate%2C%20Lagos%20106104%2C%20Lagos!5e0!3m2!1sen!2sng!4v1741432898679!5m2!1sen!2sng"
							width="100%"
							height="120"
							style={{
								border: 0,
								borderRadius: "10px",
								boxShadow: "0 3px 4px rgba(0, 0, 0, 0.15)",
							}}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Our office location"
						></iframe>
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
