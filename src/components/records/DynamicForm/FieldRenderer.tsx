import { memo } from "react";
import FormField from "./FormField";
import SingleField from "./SingleField";
import EditableTableField from "./EditableTableField";
import EditableListField from "./EditableListField";
import { PATH_SEPARATOR } from "@/utils/dynamicFormUtils";

interface FieldRendererProps {
    data: Record<string, unknown>;
    path: string[];
    depth: number;
}

export const FieldRenderer = memo(({ data, path, depth }: FieldRendererProps) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => {
                const currentPath = [...path, key];
                const currentPathString = currentPath.join(PATH_SEPARATOR);

                if (Array.isArray(value)) {
                    const isTable = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
                    if (isTable) {
                        return (
                            <EditableTableField
                                key={currentPathString}
                                fieldKey={key}
                                value={value as Array<Record<string, string>>}
                                currentPath={currentPath}
                                pathString={currentPathString}
                                depth={depth + 1}
                            />
                        );
                    } else {
                        return (
                            <EditableListField
                                key={currentPathString}
                                fieldKey={key}
                                value={value as string[]}
                                currentPath={currentPath}
                                pathString={currentPathString}
                                depth={depth + 1}
                            />
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    return (
                        <FormField
                            key={currentPathString}
                            fieldKey={key}
                            data={value as Record<string, unknown>}
                            path={currentPath}
                            depth={depth + 1}
                        />
                    );
                } else {
                    return (
                        <SingleField
                            key={currentPathString}
                            fieldKey={key}
                            value={value}
                            currentPath={currentPath}
                            pathString={currentPathString}
                        />
                    );
                }
            })}
        </>
    );
});
