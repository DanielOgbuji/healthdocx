import {
    CloseButton,
    Field,
    Fieldset,
    Input,
    InputGroup,
    Icon,
    IconButton,
    NativeSelect,
    Button,
    For,
    Flex,
} from "@chakra-ui/react";
import { MdOutlineUndo, MdOutlineArrowForward, MdOutlineAddBusiness, MdOutlineAddLocationAlt, MdOutlineNumbers } from "react-icons/md";
import { useHookFormMask } from "use-mask-input";
import * as motion from "motion/react-client";
import { INSTITUTION_TYPE_OPTIONS, SIZE_OPTIONS } from "@/constants/formConstants";
import { useInstitutionDetails } from "@/hooks/onboarding/useInstitutionDetails";

export default function InstitutionDetailsForm() {
    const {
        register,
        onSubmit,
        reset,
        errors,
        isSubmitting,
        isValid,
        locationInput,
        suggestions,
        showSuggestions,
        inputRef,
        handleLocationChange,
        handleLocationSelect,
        clearLocation
    } = useInstitutionDetails();

    const registerWithMask = useHookFormMask(register);

    const endElement = locationInput ? (
        <CloseButton
            size="xs"
            onClick={clearLocation}
            me="-2"
        />
    ) : undefined;

    return (
        <form onSubmit={onSubmit} onReset={() => reset({})} noValidate aria-label="Institution registration form">
            <Fieldset.Root size="lg" width={{ base: "xs", md: "lg", lg: "lg" }}>
                <Fieldset.Content>
                    <Field.Root invalid={!!errors.institutionName} required>
                        <Field.Label>Institution Name<Field.RequiredIndicator /></Field.Label>
                        <InputGroup startElement={<Icon size="md" color="outline"><MdOutlineAddBusiness /></Icon>}>
                            <Input
                                autoFocus
                                aria-describedby={errors.institutionName ? "institutionName-error" : undefined}
                                id="institutionName"
                                type="text"
                                placeholder="Enter institution name"
                                {...register("institutionName", {
                                    required: "Institution name is required",
                                    maxLength: { value: 75, message: "Maximum length is 75 characters" }
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="institutionName-error">{errors.institutionName?.message?.toString()}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.location} required>
                        <Field.Label>Location<Field.RequiredIndicator /></Field.Label>
                        <InputGroup startElement={<Icon size="md" color="outline"><MdOutlineAddLocationAlt /></Icon>} endElement={endElement}>
                            <Input
                                aria-describedby={errors.location ? "location-error" : undefined}
                                id="location"
                                type="text"
                                borderBottomRadius={showSuggestions ? "none" : undefined}
                                placeholder="Enter institution location"
                                value={locationInput}
                                {...register("location", {
                                    required: "Location is required",
                                    maxLength: { value: 100, message: "Maximum length is 100 characters" },
                                    onChange: handleLocationChange
                                })}
                                ref={(el) => {
                                    inputRef.current = el;
                                    register("location").ref(el);
                                }}
                            />
                        </InputGroup>
                        {showSuggestions && suggestions.length > 0 && (
                            <NativeSelect.Root size="xs" mt="-7px">
                                <NativeSelect.Field
                                    title="Suggested locations"
                                    borderTop="none"
                                    borderTopRadius="none"
                                    color="fg.muted"
                                    onChange={handleLocationSelect}
                                >
                                    <option value="">Select a suggested location</option>
                                    {suggestions.map((s, idx) => (
                                        <option key={idx} value={s.properties.formatted}>
                                            {s.properties.formatted}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                        )}
                        <Field.ErrorText id="location-error">{errors.location?.message?.toString()}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.institutionType} required>
                        <Field.Label>Institution Type<Field.RequiredIndicator /></Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                aria-describedby={errors.institutionType ? "institutionType-error" : undefined}
                                id="institutionType"
                                placeholder="Select institution type"
                                {...register("institutionType", { required: "Institution type is required" })}
                            >
                                <For each={INSTITUTION_TYPE_OPTIONS}>
                                    {(option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    )}
                                </For>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Field.ErrorText id="institutionType-error">{errors.institutionType?.message?.toString()}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.sizeRange} required>
                        <Field.Label>Institution Size<Field.RequiredIndicator /></Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                aria-describedby={errors.sizeRange ? "size-error" : undefined}
                                id="size"
                                placeholder="Select institution size"
                                {...register("sizeRange", { required: "Institution size is required" })}
                            >
                                <For each={SIZE_OPTIONS}>
                                    {(option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    )}
                                </For>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Field.ErrorText id="size-error">{errors.sizeRange?.message?.toString()}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.licenseNumber} required>
                        <Field.Label>License Number<Field.RequiredIndicator /></Field.Label>
                        <InputGroup startElement={<Icon size="md" color="outline"><MdOutlineNumbers /></Icon>}>
                            <Input
                                aria-describedby={errors.licenseNumber ? "licenseNumber-error" : undefined}
                                id="licenseNumber"
                                type="text"
                                placeholder="Enter 7-digit license number"
                                {...registerWithMask("licenseNumber", ["9999999"], {
                                    required: "License number is required",
                                    pattern: {
                                        value: /^\d{7}$/,
                                        message: "License number must be exactly 7 digits"
                                    }
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="licenseNumber-error">{errors.licenseNumber?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                </Fieldset.Content>

                <Flex width="full" gap="2">
                    <Button
                        display="flex"
                        flex="1"
                        type="submit"
                        fontWeight="bold"
                        loading={isSubmitting}
                        loadingText="Submitting"
                        disabled={!isValid || isSubmitting}
                        _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                    >
                        Save Institution Details
                        {!isSubmitting && isValid && (
                            <motion.div
                                initial={{ transform: "translateX(0px)" }}
                                animate={{
                                    transform: [
                                        "translateX(10px)",
                                        "translate(0px)",
                                        "translateX(10px)",
                                    ],
                                }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                            >
                                <Icon size="sm" mt="-2px"><MdOutlineArrowForward /></Icon>
                            </motion.div>
                        )}
                    </Button>
                    <IconButton
                        aria-label="Reset form"
                        type="reset"
                        variant="outline"
                        color="error"
                        borderColor="error"
                        _hover={{ bg: 'errorSubtle' }}
                        title="Reset Form"
                    >
                        <MdOutlineUndo />
                    </IconButton>
                </Flex>
            </Fieldset.Root>
        </form>
    );
}
