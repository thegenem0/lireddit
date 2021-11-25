import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { VoteSection } from "../components/VoteSection";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [, deletePost] = useDeletePostMutation();

  const [{ data: meData }] = useMeQuery();

  if (!fetching && !data) {
    return <div>Query failed...sad</div>;
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => !p ? null : (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <VoteSection post={p} />
              <Box flex={1}>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text ml="auto">Posted by: {p.postCreator.username}</Text>
                <Flex asign="center">
                  <Text mt={4}>{p.textSnippet}</Text>
                  <IconButton
                    ml="auto"
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    aria-label="delete-post"
                    isDisabled={meData && p.postCreator.id !== meData.me?.id ? true : false}
                    onClick={() => {
                      deletePost({id: p.id})
                    }}
                  ></IconButton>
                  <div>{}</div>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables?.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
