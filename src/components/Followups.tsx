import React, { useEffect, useMemo, useState, useCallback, useRef, useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";
import {
    ChevronRight,
    ChevronLeft,
    Bell,
    MessageSquare,
    Plus,
    Brain,
    Search,
    X,
    ChevronDown,
    Check,
    Trash2,
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import Vector80266 from "../imports/Vector-802-66";
import { MagicalLoadingText } from "./MagicalLoadingText";
import { generateWithOpenAI, getBusinessContext } from '../utils/openai';

const followUpAIInstructionVariations = [
    "Use a warm, friendly tone. Greet the customer by name, reference their last appointment or service, and ask if they have any questions. Keep the message concise and end with an invitation to book again.",
    "Be professional yet approachable. Mention the specific service the customer received, express gratitude for their visit, and offer a helpful tip related to their service. Include a subtle call-to-action for rebooking.",
    "Write in a caring, empathetic tone. Check in on the customer's experience, ask if everything met their expectations, and let them know you're available for any follow-up needs. Keep it personal and genuine.",
    "Adopt a concise, action-oriented style. Thank the customer briefly, highlight any aftercare instructions relevant to their service, and provide a direct link or prompt to schedule their next visit.",
    "Use an enthusiastic, upbeat tone. Celebrate the customer's recent visit, share a relevant promotion or loyalty reward they've earned, and encourage them to spread the word or leave a review.",
    "Be calm and reassuring. Follow up to ensure the customer is satisfied with their experience, address any potential concerns proactively, and remind them of your support channels if they need anything.",
    "Write with a consultative approach. Reference the customer's specific needs discussed during their visit, offer personalized recommendations for their next appointment, and position yourself as their trusted advisor.",
    "Keep the tone light and conversational. Send a quick check-in message, share a fun fact or seasonal tip related to your business, and casually remind them about upcoming availability for their next booking.",
];

/**
 * Sheet mapping
 * Follow-Ups
 *  - Create A Follow-Up
 *
 * Follow-Ups Submenu
 *  - Follow up Title
 *  - Follow up Description
 *  - Follow up Repetition
 *  - Follow up AI Instructions
 *  - Customer Exclusion List
 */

interface FollowupsProps {
    onNavigate: (page: string) => void;
    onSave?: () => void;
}

type FollowUpRepetition =
    | "none"
    | "daily"
    | "weekly"
    | "monthly";

interface FollowUp {
    id: string;
    // main entity
    title: string;
    description: string;
    repetition: FollowUpRepetition;
    aiInstructions: string;
    customerExclusionList: string[];
    isEnabled: boolean;
    icon: React.ReactNode;
}

const defaultFollowUp = (): FollowUp => ({
    id: `fu_${crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
    title: "",
    description: "",
    repetition: "none",
    aiInstructions: "",
    customerExclusionList: [],
    isEnabled: true,
    icon: <MessageSquare className="w-5 h-5" />,
});

function parseExclusionList(value: string): string[] {
    return value
        .split(/\n|,/g)
        .map((s) => s.trim())
        .filter(Boolean);
}

function formatExclusionList(list: string[]): string {
    return list.join("\n");
}

function repetitionLabel(r: FollowUpRepetition) {
    switch (r) {
        case "none":
            return "No repetition";
        case "daily":
            return "Daily";
        case "weekly":
            return "Weekly";
        case "monthly":
            return "Monthly";
        default:
            return "No repetition";
    }
}

function FollowUpModal({
    open,
    onOpenChange,
    mode,
    initial,
    onSave,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode: "create" | "edit";
    initial: FollowUp;
    onSave: (payload: FollowUp) => void;
}) {
    const [title, setTitle] = useState(initial.title);
    const [description, setDescription] = useState(
        initial.description,
    );
    const [repetition, setRepetition] =
        useState<FollowUpRepetition>(initial.repetition);
    const [aiInstructions, setAiInstructions] = useState(
        initial.aiInstructions,
    );
    const [excludedCustomerIds, setExcludedCustomerIds] = useState<string[]>(
        initial.customerExclusionList,
    );

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const aiVariationIndexRef = useRef(0);

    useEffect(() => {
        if (!open) return;
        setTitle(initial.title);
        setDescription(initial.description);
        setRepetition(initial.repetition);
        setAiInstructions(initial.aiInstructions);
        setExcludedCustomerIds(initial.customerExclusionList);
    }, [open, initial]);

    const canSave = useMemo(() => {
        return title.trim().length > 0;
    }, [title]);

    const handleSave = () => {
        if (!canSave) {
            toast.error("Please enter Follow up Title");
            return;
        }

        onSave({
            ...initial,
            title: title.trim(),
            description: description.trim(),
            repetition,
            aiInstructions: aiInstructions.trim(),
            customerExclusionList: excludedCustomerIds,
        });

        // Close modal after successful save
        onOpenChange(false);
    };

    const handleGenerateAI = useCallback(async () => {
        if (isGeneratingAI) return;
        setIsGeneratingAI(true);
        try {
            const { companyName, lineOfBusiness } = getBusinessContext();
            const systemPrompt = `You are a business AI assistant. Generate concise AI follow-up instructions for an automated follow-up system. Write in 1-2 sentences. Professional and actionable tone.`;
            const userPrompt = `Generate AI follow-up instructions${companyName ? ` for ${companyName}` : ''}${lineOfBusiness ? ` (${lineOfBusiness})` : ''}. These instructions tell the AI how to handle customer follow-ups. Example: "Follow up with customers 24 hours after their appointment to check satisfaction and offer rebooking."`;
            const generated = await generateWithOpenAI(systemPrompt, userPrompt);
            setAiInstructions(generated);
            toast.success('AI instructions generated!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate AI instructions');
        } finally {
            setIsGeneratingAI(false);
        }
    }, [isGeneratingAI]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create"
                            ? "Create Follow-up"
                            : "Edit Follow-up"}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a follow-up for
                        your customers.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 gap-5 px-1 pb-4">
                        <div className="space-y-2">
                            <Label>Follow up Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Post-appointment check-in"
                                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Follow up Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will this follow-up do?"
                                className="min-h-[90px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Follow up Repetition</Label>
                            <Select
                                value={repetition}
                                onValueChange={(v) =>
                                    setRepetition(v as FollowUpRepetition)
                                }
                            >
                                <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                                    <SelectValue>
                                        {repetitionLabel(repetition)}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="z-[10000000]">
                                    <SelectItem value="none">
                                        No repetition
                                    </SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                If enabled, the follow-up will repeat
                                automatically.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Follow up AI Instructions</Label>
                            <div>
                                <Textarea
                                    value={aiInstructions}
                                    onChange={(e) =>
                                        setAiInstructions(e.target.value)
                                    }
                                    placeholder="Give the AI instructions for tone, message style, and what to include..."
                                    className="min-h-[120px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                                />
                                <div
                                    onClick={handleGenerateAI}
                                    className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingAI ? 'text-blue-400 dark:text-blue-500 cursor-wait' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer'} transition-colors`}
                                >
                                    <MagicalLoadingText isLoading={isGeneratingAI} icon={<Brain className="w-3.5 h-3.5" />}>
                                        <span>Generate using AI</span>
                                    </MagicalLoadingText>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Customer Exclusion List</Label>
                            <CustomerExclusionSelect
                                selectedIds={excludedCustomerIds}
                                onChange={setExcludedCustomerIds}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                These customers will never receive this
                                follow-up.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                    >
                        {mode === "create"
                            ? "Create Follow-up"
                            : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function Followups({ onNavigate, onSave }: FollowupsProps) {
    const { getFilterClasses } = useContext(FilterContext);
    const [isLoading, setIsLoading] = useState(true);
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);

    // For navigation to detail pages (editing existing)
    const [selectedFollowUp, setSelectedFollowUp] =
        useState<FollowUp | null>(null);

    // For modal-based creation
    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);
    const [createFollowUpData, setCreateFollowUpData] =
        useState<FollowUp>(defaultFollowUp());

    useEffect(() => {
        fetchFollowUps();
    }, []);

    const fetchFollowUps = async () => {
        setIsLoading(true);

        // Simulated backend data (now matching sheet fields)
        setTimeout(() => {
            const mockData: FollowUp[] = [];

            setFollowUps(mockData);
            setIsLoading(false);
        }, 450);
    };

    const openCreate = () => {
        setIsCreateModalOpen(true);
        setCreateFollowUpData(defaultFollowUp());
    };

    const openFollowUpDetail = (followUp: FollowUp) => {
        setSelectedFollowUp(followUp);
    };

    const handleDeleteFollowUp = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFollowUps((prev) => prev.filter((f) => f.id !== id));
        toast.success("Follow-up removed");
    };

    const handleSaveFollowUp = (payload: FollowUp) => {
        if (
            payload.id.startsWith("fu_") &&
            followUps.find((f) => f.id === payload.id)
        ) {
            // Editing existing
            setFollowUps((prev) =>
                prev.map((f) => (f.id === payload.id ? payload : f)),
            );
            toast.success("Follow-up updated");
        } else {
            // Creating new
            const isFirstFollowUp = followUps.length === 0;
            setFollowUps((prev) => [payload, ...prev]);
            toast.success("Follow-up created");
            // When the first follow-up is created, mark setup as complete
            if (isFirstFollowUp) {
                try {
                    const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
                    const flags = rawFlags ? JSON.parse(rawFlags) : {};
                    flags['Create A Follow-Up'] = true;
                    localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
                } catch (e) {
                    console.error('Error updating completion flags:', e);
                }
                onSave?.();
            }
        }

        setSelectedFollowUp(null);
        setIsCreateModalOpen(false); // Also close the create modal
    };

    const handleBackFromDetail = () => {
        setSelectedFollowUp(null);
    };

    // If viewing a follow-up detail, show the config modal
    if (selectedFollowUp) {
        return (
            <FollowUpConfigModal
                followUp={selectedFollowUp}
                onBack={handleBackFromDetail}
                onSave={handleSaveFollowUp}
                existingFollowUps={followUps}
            />
        );
    }

    return (
        <div className="w-full bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="relative bg-white dark:bg-gray-800">
                <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
                    <span className="font-medium opacity-0">Spacer</span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
                    <span className="font-medium opacity-0">Spacer</span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
                    <span className="font-medium opacity-0">Spacer</span>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
                    <span className="font-medium opacity-0">Spacer</span>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4 shadow-xl">
                        <Vector80266 className="w-[34px] h-[34px] text-white drop-shadow-lg" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">
                        Follow-ups
                    </span>
                    <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md px-4">
                        Automate follow-up messages to engage customers
                        after appointments and events
                    </p>
                </div>
            </div>

            {/* Menu Items Container with spacing */}
            <div className="flex flex-col gap-3 px-4 pb-3">
                {/* Create */}
                <div
                    onClick={openCreate}
                    style={{
                        paddingTop: "0.6rem",
                        paddingBottom: "0.6rem",
                    }}
                    className={`flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500 ${getFilterClasses('Create A Follow-Up')}`}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                        Create A Follow-Up
                    </span>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {followUps.map((followUp) => (
                            <div
                                key={followUp.id}
                                onClick={() => openFollowUpDetail(followUp)}
                                style={{
                                    paddingTop: "0.6rem",
                                    paddingBottom: "0.6rem",
                                }}
                                className="group flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
                            >
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {followUp.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleDeleteFollowUp(e, followUp.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && followUps.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No follow-ups configured
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Create your first follow-up to start automations.
                        </p>
                    </div>
                )}
            </div>

            {/* Create Follow-Up Modal */}
            <FollowUpModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                mode="create"
                initial={createFollowUpData}
                onSave={handleSaveFollowUp}
            />
        </div>
    );
}

function FollowUpConfigModal({
    followUp,
    onBack,
    onSave,
    existingFollowUps,
}: {
    followUp: FollowUp;
    onBack: () => void;
    onSave: (payload: FollowUp) => void;
    existingFollowUps: FollowUp[];
}) {
    const [title, setTitle] = useState(followUp.title);
    const [description, setDescription] = useState(
        followUp.description,
    );
    const [repetition, setRepetition] =
        useState<FollowUpRepetition>(followUp.repetition);
    const [aiInstructions, setAiInstructions] = useState(
        followUp.aiInstructions,
    );
    const [excludedCustomerIds, setExcludedCustomerIds] = useState<string[]>(
        followUp.customerExclusionList,
    );
    const [isEnabled, setIsEnabled] = useState(
        followUp.isEnabled,
    );

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const aiVariationIndexRef = useRef(0);

    useEffect(() => {
        setTitle(followUp.title);
        setDescription(followUp.description);
        setRepetition(followUp.repetition);
        setAiInstructions(followUp.aiInstructions);
        setExcludedCustomerIds(followUp.customerExclusionList);
        setIsEnabled(followUp.isEnabled);
    }, [followUp]);

    const canSave = useMemo(() => {
        return title.trim().length > 0;
    }, [title]);

    const handleSave = () => {
        if (!canSave) {
            toast.error("Please enter Follow up Title");
            return;
        }

        onSave({
            ...followUp,
            title: title.trim(),
            description: description.trim(),
            repetition,
            aiInstructions: aiInstructions.trim(),
            customerExclusionList: excludedCustomerIds,
            isEnabled,
        });
    };

    const handleGenerateAI = useCallback(async () => {
        if (isGeneratingAI) return;
        setIsGeneratingAI(true);
        try {
            const { companyName, lineOfBusiness } = getBusinessContext();
            const systemPrompt = `You are a business AI assistant. Generate concise AI follow-up instructions for an automated follow-up system. Write in 1-2 sentences. Professional and actionable tone.`;
            const userPrompt = `Generate AI follow-up instructions${companyName ? ` for ${companyName}` : ''}${lineOfBusiness ? ` (${lineOfBusiness})` : ''}. These instructions tell the AI how to handle customer follow-ups. Example: "Follow up with customers 24 hours after their appointment to check satisfaction and offer rebooking."`;
            const generated = await generateWithOpenAI(systemPrompt, userPrompt);
            setAiInstructions(generated);
            toast.success('AI instructions generated!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate AI instructions');
        } finally {
            setIsGeneratingAI(false);
        }
    }, [isGeneratingAI]);

    const isNewFollowUp = !existingFollowUps.find(
        (f) => f.id === followUp.id,
    );

    return (
        <div className="w-full bg-white dark:bg-gray-800">
            {/* Header with Back Button */}
            <div
                onClick={onBack}
                style={{
                    paddingTop: "0.6rem",
                    paddingBottom: "0.6rem",
                }}
                className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
            >
                <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                    {isNewFollowUp ? "Create Follow-up" : followUp.title}
                </span>
            </div>

            <div className="px-6 pt-4 pb-6 space-y-6">
                {/* Follow up Title */}
                <div className="space-y-2">
                    <Label>Follow up Title</Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Post-appointment check-in"
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                </div>

                {/* Follow up Description */}
                <div className="space-y-2">
                    <Label>Follow up Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What will this follow-up do?"
                        className="min-h-[90px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                    />
                </div>

                {/* Follow up Repetition */}
                <div className="space-y-2">
                    <Label>Follow up Repetition</Label>
                    <Select
                        value={repetition}
                        onValueChange={(v) =>
                            setRepetition(v as FollowUpRepetition)
                        }
                    >
                        <SelectTrigger className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                            <SelectValue>
                                {repetitionLabel(repetition)}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-[10000000]">
                            <SelectItem value="none">
                                No repetition
                            </SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        If enabled, the follow-up will repeat automatically.
                    </p>
                </div>

                {/* Follow up AI Instructions */}
                <div className="space-y-2">
                    <Label>Follow up AI Instructions</Label>
                    <div>
                        <Textarea
                            value={aiInstructions}
                            onChange={(e) => setAiInstructions(e.target.value)}
                            placeholder="Give the AI instructions for tone, message style, and what to include..."
                            className="min-h-[120px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                        />
                        <div
                            onClick={handleGenerateAI}
                            className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingAI ? 'text-blue-400 dark:text-blue-500 cursor-wait' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer'} transition-colors`}
                        >
                            <MagicalLoadingText isLoading={isGeneratingAI} icon={<Brain className="w-3.5 h-3.5" />}>
                                <span>Generate using AI</span>
                            </MagicalLoadingText>
                        </div>
                    </div>
                </div>

                {/* Customer Exclusion List */}
                <div className="space-y-2">
                    <Label>Customer Exclusion List</Label>
                    <CustomerExclusionSelect
                        selectedIds={excludedCustomerIds}
                        onChange={setExcludedCustomerIds}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        These customers will never receive this follow-up.
                    </p>
                </div>

                {/* Enable/Disable Toggle */}
                {!isNewFollowUp && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div>
                            <Label className="text-base">
                                Enable Follow-up
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Turn this follow-up on or off
                            </p>
                        </div>
                        <Switch
                            checked={isEnabled}
                            onCheckedChange={setIsEnabled}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                )}

                {/* Save Button */}
                <div className="pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={!canSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6"
                    >
                        {isNewFollowUp
                            ? "Create Follow-up"
                            : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const mockCustomers: Customer[] = [
    { id: "c1", name: "Ahmed Al Mansouri", email: "ahmed@example.com", phone: "+971 50 123 4567" },
    { id: "c2", name: "Fatima Hassan", email: "fatima.h@example.com", phone: "+971 55 234 5678" },
    { id: "c3", name: "Omar Khalid", email: "omar.k@example.com", phone: "+971 52 345 6789" },
    { id: "c4", name: "Sara Al Dhaheri", email: "sara.d@example.com", phone: "+971 56 456 7890" },
    { id: "c5", name: "Mohammed Rashed", email: "m.rashed@example.com", phone: "+971 50 567 8901" },
    { id: "c6", name: "Aisha Bin Zayed", email: "aisha.bz@example.com", phone: "+971 55 678 9012" },
    { id: "c7", name: "Khalid Al Maktoum", email: "khalid.m@example.com", phone: "+971 52 789 0123" },
    { id: "c8", name: "Noura Al Suwaidi", email: "noura.s@example.com", phone: "+971 56 890 1234" },
    { id: "c9", name: "Yousuf Ibrahim", email: "yousuf.i@example.com", phone: "+971 50 901 2345" },
    { id: "c10", name: "Layla Mahmoud", email: "layla.m@example.com", phone: "+971 55 012 3456" },
    { id: "c11", name: "Hassan Ali", email: "hassan.a@example.com", phone: "+971 52 111 2222" },
    { id: "c12", name: "Mariam Al Nahyan", email: "mariam.n@example.com", phone: "+971 56 333 4444" },
    { id: "c13", name: "Rashid Al Ketbi", email: "rashid.k@example.com", phone: "+971 50 555 6666" },
    { id: "c14", name: "Huda Al Falasi", email: "huda.f@example.com", phone: "+971 55 777 8888" },
    { id: "c15", name: "Saeed Al Shamsi", email: "saeed.s@example.com", phone: "+971 52 999 0000" },
];

function CustomerExclusionSelect({
    selectedIds,
    onChange,
}: {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Focus search when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            setSearch("");
        }
    }, [isOpen]);

    const filtered = useMemo(() => {
        if (!search.trim()) return mockCustomers;
        const q = search.toLowerCase();
        return mockCustomers.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.phone.includes(q)
        );
    }, [search]);

    const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));

    const toggleCustomer = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((sid) => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            const filteredIds = filtered.map((c) => c.id);
            onChange(selectedIds.filter((sid) => !filteredIds.includes(sid)));
        } else {
            const newIds = new Set(selectedIds);
            filtered.forEach((c) => newIds.add(c.id));
            onChange(Array.from(newIds));
        }
    };

    const removeCustomer = (id: string) => {
        onChange(selectedIds.filter((sid) => sid !== id));
    };

    const selectedCustomers = mockCustomers.filter((c) => selectedIds.includes(c.id));

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger / Tags area */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`min-h-[44px] w-full px-3 py-2 bg-white dark:bg-gray-900 border rounded-md cursor-pointer transition-colors flex items-center gap-1.5 flex-wrap ${isOpen
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
            >
                {selectedCustomers.length === 0 ? (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">Select customers to exclude...</span>
                ) : (
                    selectedCustomers.map((c) => (
                        <span
                            key={c.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                        >
                            {c.name}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCustomer(c.id);
                                }}
                                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))
                )}
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 ml-auto shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-[10000001] left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, or phone..."
                                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Select All */}
                    <div
                        onClick={toggleSelectAll}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                    >
                        <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${allFilteredSelected
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                        >
                            {allFilteredSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Select All{search.trim() ? " (filtered)" : ""}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                            {selectedIds.length}/{mockCustomers.length}
                        </span>
                    </div>

                    {/* Customer list */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                                No customers found
                            </div>
                        ) : (
                            filtered.map((c) => {
                                const isSelected = selectedIds.includes(c.id);
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => toggleCustomer(c.id)}
                                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${isSelected
                                                ? "bg-blue-50/60 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                    ? "bg-blue-600 border-blue-600"
                                                    : "border-gray-300 dark:border-gray-600"
                                                }`}
                                        >
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm text-gray-900 dark:text-gray-100 truncate">{c.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {c.email} · {c.phone}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
