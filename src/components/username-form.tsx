"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usernameFormSchema } from "@/lib/utils";

interface UsernameFormProps {
  onSubmit: (values: z.infer<typeof usernameFormSchema>) => void;
}

export function UsernameForm({ onSubmit }: UsernameFormProps) {
  const form = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-xs max-w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="doe john" {...field} />
              </FormControl>

              {form.formState.errors.username ? (
                <FormMessage className="-mt-2 text-sm" />
              ) : (
                <FormDescription className="-mt-2 text-sm">
                  This is your public display name.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Continue
        </Button>
      </form>
    </Form>
  );
}
