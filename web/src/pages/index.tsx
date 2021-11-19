import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,

  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Query failed...sad</div>
  }

  return (
    <Layout>
      <Flex align="center" mb={4}>
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create New Post</Link>
        </NextLink>
      </Flex>

      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? <Flex>
        <Button onClick={() => {
        setVariables({
          limit: variables?.limit,
          cursor: data.posts[data.posts.length - 1].createdAt,
        },
      );
     }} isLoading={fetching} m='auto' my={8}>Load More</Button>
      </Flex>
      : null }
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);