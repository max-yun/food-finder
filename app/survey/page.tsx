"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  location: z.string().min(1, {
    message: "Must be a valid city.",
  }),
  cuisines: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  price: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const cuisines = [
  {
    id: "chinese",
    label: "Chinese",
  },
  {
    id: "french",
    label: "French",
  },
  {
    id: "italian",
    label: "Italian",
  },
];

const price = [
  {
    id: "1",
    label: "$",
  },
  {
    id: "2",
    label: "$$",
  },
  {
    id: "3",
    label: "$$$",
  },
  {
    id: "4",
    label: "$$$$",
  },
];

export default function Survey() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      cuisines: [],
      price: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { location, cuisines, price } = values;
    const params = new URLSearchParams({
      location: location,
      cuisines: cuisines.join(","),
      price: price.join(","),
    });
    // try {
    //   const response = await fetch(
    //     `/api/restaurants?location=${location}&categories=${cuisines.join(
    //       ","
    //     )}&price=${price.join(",")}`
    //   );
    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error("Error fetching restaurants");
    // }

    try {
      const response = await fetch("api/restaurants?" + params);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Where do you want to eat?
              </FormLabel>
              <FormControl>
                <Input placeholder="Start typing a city..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuisines"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Which Cuisine?</FormLabel>
                <FormDescription>
                  Select the cuisines you would be down for.
                </FormDescription>
              </div>
              {cuisines.map((cuisine) => (
                <FormField
                  key={cuisine.id}
                  control={form.control}
                  name="cuisines"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={cuisine.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(cuisine.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, cuisine.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== cuisine.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {cuisine.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">How Much?</FormLabel>
                <FormDescription>
                  Select the prices you'd be down to spend.
                </FormDescription>
              </div>
              {price.map((price) => (
                <FormField
                  key={price.id}
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={price.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(price.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, price.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== price.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {price.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
