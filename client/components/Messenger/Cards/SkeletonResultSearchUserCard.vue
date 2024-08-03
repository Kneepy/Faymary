<template>
    <SkeletonLoader :count=3 :distance=10 :padding=10>
        <SkeletonRow :flex=0 column>
            <Skeleton :width=40 :height=40 :radius=50 />
        </SkeletonRow>
        <SkeletonRow :flex=1 column>
            <Skeleton :margin="[0, 0, 10, 15]" />
            <Skeleton :margin="[0, 0, 0, 15]" />
        </SkeletonRow>
    </SkeletonLoader>
</template>
<script setup lang="ts">
</script>