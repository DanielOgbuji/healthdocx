import { Badge, Box, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { MdLocationOn } from 'react-icons/md';
import Youtube from "@/assets/images/youtube.svg";
import Instagram from "@/assets/images/instagram.svg";
import Linkedin from "@/assets/images/linkedin.svg";
import Whatsapp from "@/assets/images/whatsapp.svg";
import X from "@/assets/images/x.svg";

const ContactInfo = () => {
    return (
        <Stack gap="8" width="100%">
            <Box>
                <Text textStyle="3xl" fontSize="3xl" fontWeight="bold" mb="6">
                    Contact Us
                </Text>

                <Flex
                    direction="column"
                    gap="2"
                    borderBottomWidth="thin"
                    borderBottomStyle="dashed"
                    pb="4"
                    borderColor="outline/20"
                >
                    <Text textStyle="lg" fontWeight="bold">
                        Email support
                    </Text>
                    <Text textStyle="sm" color="fg.muted">
                        Email us and we'll get back to you within 24 hours.
                    </Text>
                    <Link
                        variant="underline"
                        textStyle="sm"
                        href="mailto:support@healthdocx.io"
                        color="primary"
                    >
                        support@healthdocx.io
                    </Link>
                </Flex>

                <Flex
                    direction="column"
                    gap="2"
                    borderBottomWidth="thin"
                    borderBottomStyle="dashed"
                    pt="4"
                    pb="4"
                    borderColor="outline/20"
                >
                    <Text textStyle="lg" fontWeight="bold">
                        Chat support
                    </Text>
                    <Text textStyle="sm" color="fg.muted">
                        Chat our staff 24/7 for instant access to support.
                    </Text>
                    <Flex gap="3" alignItems="center">
                        <Link variant="underline" textStyle="sm" href="#" color="primary">
                            Start Live Chat
                        </Link>
                        <Badge
                            colorPalette="red"
                            variant="subtle"
                            borderRadius="full"
                            px="2"
                            display="flex"
                            alignItems="center"
                            gap="1"
                        >
                            <Box as="span" fontSize="2xl" lineHeight="0" mb="1">•</Box> Offline
                        </Badge>
                    </Flex>
                </Flex>

                <Flex
                    direction="column"
                    gap="2"
                    borderBottomWidth="thin"
                    borderBottomStyle="dashed"
                    pt="4"
                    pb="4"
                    borderColor="outline/20"
                >
                    <Text textStyle="lg" fontWeight="bold">
                        Call us
                    </Text>
                    <Text textStyle="sm" color="fg.muted">
                        Mon - Sat • 9:00AM - 5:00PM (WAT)
                    </Text>
                    <Flex direction="row" gap="1">
                        <Link
                            variant="underline"
                            textStyle="sm"
                            href="tel:+2348000000000"
                            color="primary"
                        >
                            +234 800 000 0000
                        </Link>
                        ,
                        <Link
                            variant="underline"
                            textStyle="sm"
                            href="tel:+2347000000001"
                            color="primary"
                        >
                            +234 700 000 0001
                        </Link>
                    </Flex>
                </Flex>

                <Flex direction="column" gap="2" pt="4" pb="4">
                    <Text
                        textStyle="lg"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        gap="2"
                    >
                        Walk in <Badge colorPalette="green">Lagos</Badge>
                    </Text>
                    <Text textStyle="sm" color="fg.muted">
                        Visit our office Mon - Sat • 9:00AM - 5:00PM.
                    </Text>
                    <Flex gap="2" alignItems="center">
                        <Box as={MdLocationOn} color="primary" />
                        <Link
                            variant="underline"
                            textStyle="sm"
                            href="https://maps.app.goo.gl/jiNBdodUFQLuch2XA"
                            pb="3"
                            color="primary"
                            target="_blank"
                        >
                            13 Dolphine Estate, Ikeja Way, Lagos, NG.
                        </Link>
                    </Flex>
                    <Box
                        borderRadius="10px"
                        overflow="hidden"
                        boxShadow="sm"
                        height="120px"
                        width="100%"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4895512938538!2d3.413106744107315!3d6.459488576905882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b3565684049%3A0xe564840408c42fc3!2sIkeja%20Way%2C%20Dolphine%20Estate%2C%20Lagos%20106104%2C%20Lagos!5e0!3m2!1sen!2sng!4v1741432898679!5m2!1sen!2sng"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Our office location"
                        ></iframe>
                    </Box>
                </Flex>
            </Box>

            <Flex gap="3" width="full" justifyContent="center">
                {[Youtube, Instagram, Linkedin, Whatsapp, X].map((icon, idx) => (
                    <Link key={idx} href="#" target="_blank">
                        <Image src={icon} alt="social" width="32px" _hover={{ opacity: 0.8 }} transition="opacity 0.2s" />
                    </Link>
                ))}
            </Flex>
        </Stack>
    );
};

export default ContactInfo;
