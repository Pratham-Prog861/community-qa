function serializeUser(user) {
  if (!user) return undefined;
  const u = user.toJSON ? user.toJSON() : user;
  return {
    id: (u._id ?? u.id)?.toString(),
    name: u.name,
    username: u.username,
    avatarUrl: u.avatarUrl,
    reputation: u.reputation
  };
}

export function serializeQuestion(question) {
  const q = question.toJSON ? question.toJSON() : question;
  return {
    id: (q._id ?? q.id)?.toString(),
    title: q.title,
    body: q.body,
    tags: q.tags ?? [],
    voteScore: q.voteScore ?? 0,
    answersCount: q.answersCount ?? 0,
    commentsCount: q.commentsCount ?? 0,
    viewCount: q.viewCount ?? 0,
    isClosed: q.isClosed ?? false,
    acceptedAnswer: q.acceptedAnswer
      ? q.acceptedAnswer.toString?.() ?? q.acceptedAnswer
      : undefined,
    author: serializeUser(q.author),
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    lastActivityAt: q.lastActivityAt
  };
}

export function serializeAnswer(answer) {
  const a = answer.toJSON ? answer.toJSON() : answer;
  return {
    id: (a._id ?? a.id)?.toString(),
    questionId: a.question?.toString?.() ?? a.question,
    body: a.body,
    voteScore: a.voteScore ?? 0,
    commentsCount: a.commentsCount ?? 0,
    isAccepted: Boolean(a.isAccepted),
    author: serializeUser(a.author),
    createdAt: a.createdAt,
    updatedAt: a.updatedAt
  };
}

export function serializeComment(comment) {
  const c = comment.toJSON ? comment.toJSON() : comment;
  return {
    id: (c._id ?? c.id)?.toString(),
    questionId: c.question?.toString?.() ?? c.question,
    answerId: c.answer ? c.answer.toString?.() ?? c.answer : undefined,
    body: c.body,
    author: serializeUser(c.author),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  };
}

