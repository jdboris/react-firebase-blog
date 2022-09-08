export const idConverter = {
  toFirestore: (data) => data,
  fromFirestore: (snap) => ({
    id: snap.id,
    ...snap.data(),
  }),
};

export const dateConverter = {
  toFirestore: (data) => data,
  fromFirestore: (snap) => {
    const data = snap.data();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value?.constructor?.name === "ut" ? value.toDate() : value,
      ])
    );
  },
};

export const idAndDateConverter = {
  toFirestore: (data) => data,
  fromFirestore: (snap) => {
    const data = {
      id: snap.id,
      ...snap.data(),
    };

    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value?.constructor?.name === "ut" ? value.toDate() : value,
      ])
    );
  },
};
