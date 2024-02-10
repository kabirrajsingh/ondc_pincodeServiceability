def get_formatted_output(setto,zfill_len=0):
  if len(setto)==0:
    return "EMPTY"

  return ','.join(sorted(list(map(lambda x:str(x).zfill(zfill_len),set(setto)))))
