interface SignatureThirdPersonProps {
  signatureThirdPersonName: string;
  signatureThirdPersonSurname: string;
  setSignatureThirdPersonName: (value: string) => void;
  setSignatureThirdPersonSurname: (value: string) => void;
  isThirdPersonOnSignature?: boolean;
  setIsThirdPersonOnSignature: (value: boolean) => void;
}

const SignatureThirdPerson: React.FC<SignatureThirdPersonProps> = ({
  setSignatureThirdPersonName,
  setSignatureThirdPersonSurname,
  signatureThirdPersonName,
  signatureThirdPersonSurname,
  isThirdPersonOnSignature,
  setIsThirdPersonOnSignature,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsThirdPersonOnSignature(e.target.checked);
  };

  return (
    <div className="flex flex-col gap-3 mb-3">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isThirdPersonOnSignature}
          onChange={handleCheckboxChange}
        />
        <span>Sign as third person</span>
      </label>

      {isThirdPersonOnSignature && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            value={signatureThirdPersonName}
            onChange={(e) => setSignatureThirdPersonName(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="Surname"
            value={signatureThirdPersonSurname}
            onChange={(e) => setSignatureThirdPersonSurname(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>
      )}
    </div>
  );
};

export default SignatureThirdPerson;
