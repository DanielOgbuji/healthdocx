import { Container, Stack } from "@chakra-ui/react";
import ContactForm from "@/components/support/ContactForm";
import ContactLayout from "@/components/support/ContactLayout";

const ContactSupport = () => {
    return (
        <ContactLayout>
            <Container maxW="container.md" py="8" height="100%" display="flex" alignItems="center" justifyContent="center">
                <Stack justifyContent="center" alignItems="center" width="100%">
                    <ContactForm
                        legendText="Get in touch"
                        helperText="Our friendly team would love to hear from you."
                    />
                </Stack>
            </Container>
        </ContactLayout>
    );
};

export default ContactSupport;
