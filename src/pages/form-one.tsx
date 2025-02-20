import React from "react";
import {
    Group,
    Field,
    Fieldset,
    Image,
    Input,
    InputAddon,
    Stack,
} from "@chakra-ui/react";
import {
    NativeSelectField,
    NativeSelectRoot,
} from "@/components/ui/native-select";
import {
    PasswordInput,
    PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { withMask } from "use-mask-input";

interface OnBoardingFormProps {
    legendText: string;
    helperText: string;
}

const OnBoardingForm: React.FC<OnBoardingFormProps> = ({ legendText, helperText }) => {
    return (
        <>
            <Fieldset.Root size="lg" maxW="lg">
                <Stack alignItems="center">
                    <Image
                        src="src/assets/Off-Jeay.svg" mb="12px" />
                    <Fieldset.Legend>{legendText}</Fieldset.Legend>
                    <Fieldset.HelperText textAlign="center">
                        {helperText}
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root>
                        <Field.Label>Full Name</Field.Label>
                        <Input placeholder="Enter as it appears on official documents" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Email Address</Field.Label>
                        <Input placeholder="Add work email" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Role</Field.Label>
                        <NativeSelectRoot>
                            <NativeSelectField items={["Option 1", "Option 2", "Option 3"]} />
                        </NativeSelectRoot>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Phone Number</Field.Label>
                        <Group attached width="100%">
                            <InputAddon>+234</InputAddon>
                            <Input
                                placeholder="(9) 99-999-99999"
                                ref={withMask("(9) 99-999-99999")}
                            />
                        </Group>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Stack width="100%">
                            <PasswordInput placeholder="Enter a password" />
                            <Field.HelperText>Must be at least 8 characters, 1 number, 1 symbol.</Field.HelperText>
                            <PasswordStrengthMeter value={2} />
                        </Stack>
                    </Field.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        </>
    );
};

export default OnBoardingForm;
