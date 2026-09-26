import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useDebouncedValue, useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import AppWrapper from "@/components/ui/wrapper/AppWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { useSearchProfiles, type ProfileFilters } from "./useSearchProfiles";
import {
  Avatar,
  Text,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Stack,
  TextInput,
  Title,
  Paper,
  Select,
} from "@mantine/core";

const SearchProfileCOntent = () => {
  const [fullName, setFullName] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [userIdFilter, setUserIdFilter] = useState("");

  const [debouncedFullName] = useDebouncedValue(fullName, 400);

  const { fetchProfiles } = useSearchProfiles();

  const currentFilters: ProfileFilters = {
    fullName: debouncedFullName || undefined,
    userId: userIdFilter || undefined,
    sortBy,
    sortOrder: sortOrder as "asc" | "desc",
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["profiles", currentFilters],
    queryFn: ({ pageParam }) =>
      fetchProfiles({ pageParam, filters: currentFilters }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 10 ? undefined : allPages.length;
    },
  });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1.0,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProfiles = data?.pages.flat() || [];

  return (
    <div className={styles.container}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <TextInput
            placeholder="Введите имя для поиска..."
            value={fullName}
            onChange={(e) => setFullName(e.currentTarget.value)}
            size="md"
            mb="lg"
          />

          {isLoading && (
            <Center py="xl">
              <Loader size="md" />
            </Center>
          )}

          {isError && (
            <Text color="red" ta="center">
              Произошла ошибка при загрузке данных.
            </Text>
          )}

          {!isLoading && allProfiles.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              Профили не найдены
            </Text>
          )}

          <Stack gap="md">
            {allProfiles.map((profile) => (
              <a href={`/profile/${profile.id}`}>
                <Card
                  key={profile.id}
                  withBorder
                  shadow="sm"
                  radius="md"
                  padding="sm"
                >
                  <Group wrap="nowrap">
                    <Avatar src={profile.avatar} size="lg" radius="xl" />
                    <div>
                      <Text fw={500} size="lg">
                        {profile.fullName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(profile.birthDate).toLocaleDateString()} —{" "}
                        {new Date(profile.deathDate).toLocaleDateString()}
                      </Text>
                    </div>
                  </Group>
                </Card>
              </a>
            ))}

            <div ref={ref} style={{ height: 20 }}>
              {isFetchingNextPage && (
                <Center>
                  <Loader size="sm" variant="dots" />
                </Center>
              )}
            </div>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">
              Фильтры и сортировка
            </Title>

            <Stack gap="sm">
              <Select
                label="Сортировать по"
                value={sortBy}
                onChange={(val) => setSortBy(val || "createdAt")}
                data={[
                  { value: "createdAt", label: "Дате создания" },
                  { value: "fullName", label: "Имени" },
                  { value: "birthDate", label: "Дате рождения" },
                  { value: "deathDate", label: "Дате смерти" },
                ]}
              />

              <Select
                label="Направление"
                value={sortOrder}
                onChange={(val) => setSortOrder(val || "desc")}
                data={[
                  { value: "desc", label: "По убыванию" },
                  { value: "asc", label: "По возрастанию" },
                ]}
              />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export const SearchProfile = () => {
  return (
    <QueryProvider>
      <AppWrapper>
        <SearchProfileCOntent />
      </AppWrapper>
    </QueryProvider>
  );
};
